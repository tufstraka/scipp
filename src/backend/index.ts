import {
  query,
  update,
  Variant,
  Vec,
  Record,
  nat64,
  Principal,
  text,
  Null,
  Result,
  ic,
  StableBTreeMap,
  Canister,
  bool,
} from "azle/experimental";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  author: Principal;
  timestamp: bigint;
  citations: string[];
  citedBy: string[];
  reviewStatus:
    | {
        Pending: null;
      }
    | {
        Reviewed: null;
      };
  reviews: string[];
  upVotes: bigint;
  downVotes: bigint;
  votersList: Principal[];
}

const ReviewStatus = Variant({
  Pending: Null,
  Reviewed: Null,
});

const Paper = Record({
  id: text,
  title: text,
  abstract: text,
  content: text,
  author: Principal,
  timestamp: nat64,
  citations: Vec(text),
  citedBy: Vec(text),
  reviewStatus: ReviewStatus,
  reviews: Vec(text),
  upVotes: nat64,
  downVotes: nat64,
  votersList: Vec(Principal),
});

interface Review {
  id: string;
  paperId: string;
  reviewer: Principal;
  content: string;
  rating: bigint;
  timestamp: bigint;
}

const Review = Record({
  id: text,
  paperId: text,
  reviewer: Principal,
  content: text,
  rating: nat64,
  timestamp: nat64,
});

const Error = Variant({
  NotFound: text,
  AlreadyExists: text,
  NotAuthorized: text,
  InvalidInput: text,
  DuplicateVote: text,
  SelfReview: text,
  SelfVote: text,
});

const papers = StableBTreeMap(0, text, Paper);
const reviews = StableBTreeMap(1, text, Review);
const userReputations = StableBTreeMap(2, Principal, nat64);

// Helper function to generate unique IDs
function generateId(): text {
  return `${ic.caller().toString()}_${ic.time().toString()}`;
}

export default Canister({
  // Query functions
  getPaper: query([text], Result(Paper, Error), (id: text) => {
    const paper: Paper = papers.get(id);
    if (!paper) {
      return { Err: { NotFound: `Paper with ID ${id} not found` } };
    }
    return { Ok: paper };
  }),

  listPapers: query([], Vec(Paper), () => {
    return papers.values();
  }),

  getAuthorPapers: query([Principal], Vec(Paper), (author) => {
    return papers
      .values()
      .filter((paper) => paper.author.toString() === author.toString());
  }),

  // Update functions
  publishPaper: update(
    [text, text, text],
    Result(Paper, Error),
    (title, abstract, content) => {
      // Generate a unique ID for the paper
      const id = generateId();
      const paper = {
        id,
        title,
        abstract,
        content,
        author: ic.caller(),
        timestamp: ic.time(),
        citations: [],
        citedBy: [],
        reviewStatus: { Pending: null },
        reviews: [],
        upVotes: 0n,
        downVotes: 0n,
        votersList: [],
      };

      papers.insert(id, paper);
      return { Ok: paper };
    }
  ),

  submitReview: update(
    [text, text, nat64],
    Result(Review, Error),
    (paperId, content, rating) => {
      const paper: Paper = papers.get(paperId);

      if (!paper) {
        return { Err: { NotFound: `Paper with ID ${paperId} not found` } };
      }

      // Prevent self-review
      if (paper.author.toString() === ic.caller().toString()) {
        return {
          Err: { SelfReview: "Authors cannot review their own papers" },
        };
      }

      // Check if rating is valid (1-5)
      if (rating < 1n || rating > 5n) {
        return { Err: { InvalidInput: "Rating must be between 1 and 5" } };
      }

      // Check if reviewer has already submitted a review
      const existingReview: Review = reviews
        .values()
        .find(
          (review) =>
            review.paperId === paperId &&
            review.reviewer.toString() === ic.caller().toString()
        );
      if (existingReview) {
        return {
          Err: { AlreadyExists: "You have already reviewed this paper" },
        };
      }

      const id = generateId();
      const review: Review = {
        id,
        paperId,
        reviewer: ic.caller(),
        content,
        rating,
        timestamp: ic.time(),
      };

      reviews.insert(id, review);

      // Update paper's reviews and status
      const updatedPaper: Paper = {
        ...paper,
        reviews: [...paper.reviews, id],
        reviewStatus:
          paper.reviews.length >= 2 ? { Reviewed: null } : { Pending: null },
      };
      papers.insert(paperId, updatedPaper);

      // Update reviewer's reputation
      const currentReputation = userReputations.get(ic.caller()) || 0n;
      userReputations.insert(ic.caller(), currentReputation + 1n);

      return { Ok: review };
    }
  ),

  upVotePaper: update([text], Result(Paper, Error), (paperId) => {
    const paper: Paper = papers.get(paperId);

    if (!paper) {
      return { Err: { NotFound: `Paper with ID ${paperId} not found` } };
    }

    // Check if the voter is the author
    if (paper.author.toString() === ic.caller().toString()) {
      return { Err: { SelfVote: "Authors cannot vote for their own papers" } };
    }

    // Check for duplicate votes
    if (
      paper.votersList.some(
        (voter: Principal) => voter.toString() === ic.caller().toString()
      )
    ) {
      return {
        Err: { DuplicateVote: "You have already voted for this paper" },
      };
    }

    const updatedPaper: Paper = {
      ...paper,
      upVotes: paper.upVotes + 1n,
      votersList: [...paper.votersList, ic.caller()],
    };

    papers.insert(paperId, updatedPaper);
    return { Ok: updatedPaper };
  }),

  downVotePaper: update([text], Result(Paper, Error), (paperId) => {
    const paper: Paper = papers.get(paperId);

    if (!paper) {
      return { Err: { NotFound: `Paper with ID ${paperId} not found` } };
    }

    // Check if the voter is the author
    if (paper.author.toString() === ic.caller().toString()) {
      return { Err: { SelfVote: "Authors cannot vote for their own papers" } };
    }

    // Check for duplicate votes
    if (
      paper.votersList.some(
        (voter: Principal) => voter.toString() === ic.caller().toString()
      )
    ) {
      return {
        Err: { DuplicateVote: "You have already voted for this paper" },
      };
    }

    const updatedPaper: Paper = {
      ...paper,
      downVotes: paper.downVotes + 1n,
      votersList: [...paper.votersList, ic.caller()],
    };

    papers.insert(paperId, updatedPaper);
    return { Ok: updatedPaper };
  }),

  citePaper: update(
    [text, text],
    Result(Paper, Error),
    (paperId, citationId) => {
      const paper: Paper = papers.get(paperId);
      const citedPaper: Paper = papers.get(citationId);

      if (!paper) {
        return { Err: { NotFound: "Paper not found" } };
      }

      if (!citedPaper) {
        return { Err: { NotFound: "Cited paper not found" } };
      }

      // Prevent self-citation
      if (paperId === citationId) {
        return { Err: { InvalidInput: "A paper cannot cite itself" } };
      }

      // Check for duplicate citations
      if (paper.citations.includes(citationId)) {
        return { Err: { AlreadyExists: "This paper is already cited" } };
      }

      // Update paper's citations list
      const updatedPaper: Paper = {
        ...paper,
        citations: [...paper.citations, citationId],
      };
      papers.insert(paperId, updatedPaper);

      // Update cited paper's citedBy list
      const updatedCitedPaper: Paper = {
        ...citedPaper,
        citedBy: [...citedPaper.citedBy, paperId],
      };
      papers.insert(citationId, updatedCitedPaper);

      return { Ok: updatedPaper };
    }
  ),

  // Reputation system
  getReputation: query([Principal], nat64, (user) => {
    return userReputations.get(user) || 0n;
  }),
});
