# 🎓 SCIPP

An approach to scientific publishing leveraging blockchain technology (ICP). This platform enables transparent, decentralized peer review and citations tracking while building researcher reputations.

## 🌟 Features

### Core Functionality

- 📝 Paper Publication
  - Submit research papers with title, abstract, and content
  - Automatic timestamp and author tracking
  - Unique paper identification system

- 👥 Peer Review System
  - Submit detailed reviews with ratings (1-5)
  - Track review status (pending/reviewed)
  - Automatic reviewer reputation building

- 🏆 Reputation System
  - Earn reputation through quality reviews
  - Track researcher contributions
  - Build verifiable academic credentials

### Additional Features

- 🗳️ Paper Voting System
- 📈 Author Statistics
- 🔍 Paper Discovery
- 💫 Dynamic Review Status Updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- DFX (latest version)
- Internet Computer CLI
- Git

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/tufstraka/scipp
    cd scipp
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Start the local Internet Computer replica

    ```bash
    dfx start --clean --background
    ```

4. Deploy the canister

    ```bash
    dfx deploy
    ```

## 💻 Usage

### Publishing a Paper

```typescript
// Example: Publishing a new paper
const result = await actor.publishPaper(
  "Quantum Computing Applications in Cryptography",
  "This paper explores the intersection of quantum computing and modern cryptography...",
  "Full paper content here..."
);
```

### Get a Paper

```typescript
// Example: get a paper
const result = await actor.getPaper(
  "paper_id_here",
);
```

### List all papers

```typescript
// Example: List all papers
const result = await actor.listPapers();
```

### List Author papers

```typescript
// Example: List all papers by an author
const result = await actor.getAuthorPapers("author_principal_here");
```

### Get User reputation

```typescript
// Example: Get user reputation
const result = await actor.getReputation("principal_here");
```

### Upvoting a Paper

```typescript
// Example: upvoting a paper
const result = await actor.upVotePaper(
  "paper_id_here",
);
```

### Downvoting a Paper

```typescript
// Example: downvoting a paper
const result = await actor.downVotePaper(
  "paper_id_here",
);
```

### Submitting a Review

```typescript
// Example: Submitting a peer review
const result = await actor.submitReview(
  "paper_id_here",
  "Comprehensive analysis with strong methodology...",
  4n  // Rating out of 5
);
```

### Citing Papers

```typescript
// Example: Adding a citation
const result = await actor.citePaper(
  "citing_paper_id",
  "cited_paper_id"
);
```

## 🏗️ Architecture

### Data Structures

```typescript
const ReviewStatus = Variant({
    Pending: Null,
    Reviewed: Null,
});

Paper {
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
}

Review {
    id: text,
    paperId: text,
    reviewer: Principal,
    content: text,
    rating: nat64,
    timestamp: nat64,
}
```

### Storage

- Utilizes `StableBTreeMap` for persistent storage
- Separate maps for papers, reviews, and user reputations
- Efficient querying and updates

## 🔒 Security Features

- Principal-based authentication
- Review validation
- Rating constraints
- Citation verification
- Automated timestamp tracking

## 🛣️ Roadmap

### Phase 1 (Current)

- ✅ Basic paper publication
- ✅ Peer review system
- ✅ Citation tracking
- ✅ Simple reputation system

### Phase 2 (Planned)

- 🔄 Paper versioning
- 💰 Token-based incentives
- 📊 Advanced analytics
- 🤝 Collaboration features

### Phase 3 (Future)

- 🔍 AI-powered paper recommendations
- 🌐 Cross-chain integration
- 📱 Mobile application
- 🤖 Automated review matching

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👏 Acknowledgments

- Internet Computer Protocol team
- Azle framework developers

## ⚠️ Disclaimer

This is an MVP version of the platform. While functional, it may require additional features and security audits before production use.

---
