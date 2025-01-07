import {
  query,
  update,
  Variant,
  Vec,
  Record,
  nat64,
  Principal,
  text,
  Result,
  ic,
  StableBTreeMap,
  Canister,
  bool
} from 'azle/experimental';

const Paper = Record({
  id: text,
  title: text,
  abstract: text,
  content: text,
  author: Principal,
  timestamp: nat64,
  citations: Vec(text),
  reviewStatus: text,
  reviews: Vec(text),
  votes: nat64,
  votersList: Vec(Principal)  
});

const Review = Record({
  id: text,
  paperId: text,
  reviewer: Principal,  
  content: text,
  rating: nat64,       
  timestamp: nat64     
});

const Error = Variant({
  NotFound: text,
  AlreadyExists: text,
  NotAuthorized: text,
  InvalidInput: text,
  DuplicateVote: text,
  SelfReview: text
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
    const paper = papers.get(id);
    if (!paper) {
      return { Err: { NotFound: `Paper with ID ${id} not found` } };
    }
    return { Ok: paper };
  }),

  listPapers: query([], Vec(Paper), () => {
    return papers.values();
  }),

  getAuthorPapers: query([Principal], Vec(Paper), (author) => {
    return papers.values().filter(paper => paper.author.toString() === author.toString());
  }),

  // Update functions
  publishPaper: update([text, text, text], Result(Paper, Error), (title, abstract, content) => {

    const id = generateId();
    const paper = {
      id,
      title,
      abstract,
      content,
      author: ic.caller(),
      timestamp: ic.time(),
      citations: [],
      reviewStatus: 'pending',
      reviews: [],
      votes: 0n,
      votersList: []  
    };

    papers.insert(id, paper);
    return { Ok: paper };
  }),

  submitReview: update([text, text, nat64], Result(Review, Error), (paperId, content, rating) => {
    const paper = papers.get(paperId);
    
    if (!paper) {
      return { Err: { NotFound: `Paper with ID ${paperId} not found` } };
    }

    // Prevent self-review
    if (paper.author.toString() === ic.caller().toString()) {
      return { Err: { SelfReview: 'Authors cannot review their own papers' } };
    }


    // Check if rating is valid (1-5)
    if (rating < 1n || rating > 5n) {
      return { Err: { InvalidInput: 'Rating must be between 1 and 5' } };
    }

    // Check if reviewer has already submitted a review
    const existingReview = reviews.values().find(
      review => review.paperId === paperId && review.reviewer.toString() === ic.caller().toString()
    );
    if (existingReview) {
      return { Err: { AlreadyExists: 'You have already reviewed this paper' } };
    }

    const id = generateId();
    const review = {
      id,
      paperId,
      reviewer: ic.caller(),
      content,
      rating,
      timestamp: ic.time()
    };

    reviews.insert(id, review);

    // Update paper's reviews and status
    const updatedPaper = {
      ...paper,
      reviews: [...paper.reviews, id],
      reviewStatus: paper.reviews.length >= 2 ? 'reviewed' : 'pending'
    };
    papers.insert(paperId, updatedPaper);

    // Update reviewer's reputation
    const currentReputation = userReputations.get(ic.caller()) || 0n;
    userReputations.insert(ic.caller(), currentReputation + 1n);

    return { Ok: review };
  }),

  votePaper: update([text], Result(Paper, Error), (paperId) => {
    const paper = papers.get(paperId);
    
    if (!paper) {
      return { Err: { NotFound: `Paper with ID ${paperId} not found` } };
    }

    // Check for duplicate votes
    if (paper.votersList.some((voter: Principal) => voter.toString() === ic.caller().toString())) {
      return { Err: { DuplicateVote: 'You have already voted for this paper' } };
    }

    const updatedPaper = {
      ...paper,
      votes: paper.votes + 1n,
      votersList: [...paper.votersList, ic.caller()]
    };

    papers.insert(paperId, updatedPaper);
    return { Ok: updatedPaper };
  }),

  citePaper: update([text, text], Result(Paper, Error), (paperId, citationId) => {
    const paper = papers.get(paperId);
    const citedPaper = papers.get(citationId);
    
    if (!paper || !citedPaper) {
      return { Err: { NotFound: 'One or both papers not found' } };
    }

    // Prevent self-citation
    if (paperId === citationId) {
      return { Err: { InvalidInput: 'A paper cannot cite itself' } };
    }

    // Check for duplicate citations
    if (paper.citations.includes(citationId)) {
      return { Err: { AlreadyExists: 'This paper is already cited' } };
    }

    const updatedPaper = {
      ...paper,
      citations: [...paper.citations, citationId]
    };

    papers.insert(paperId, updatedPaper);
    return { Ok: updatedPaper };
  }),

  // Reputation system
  getReputation: query([Principal], nat64, (user) => {
    return userReputations.get(user) || 0n;
  })
});