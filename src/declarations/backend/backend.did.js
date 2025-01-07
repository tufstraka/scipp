export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'citePaper' : IDL.Func(
        [IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'reviews' : IDL.Vec(IDL.Text),
              'votes' : IDL.Nat64,
              'reviewStatus' : IDL.Text,
              'author' : IDL.Principal,
              'timestamp' : IDL.Nat64,
              'abstract' : IDL.Text,
              'citations' : IDL.Vec(IDL.Text),
            }),
            'Err' : IDL.Variant({
              'InvalidInput' : IDL.Text,
              'NotFound' : IDL.Text,
              'NotAuthorized' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'getAuthorPapers' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'reviews' : IDL.Vec(IDL.Text),
              'votes' : IDL.Nat64,
              'reviewStatus' : IDL.Text,
              'author' : IDL.Principal,
              'timestamp' : IDL.Nat64,
              'abstract' : IDL.Text,
              'citations' : IDL.Vec(IDL.Text),
            })
          ),
        ],
        ['query'],
      ),
    'getPaper' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'reviews' : IDL.Vec(IDL.Text),
              'votes' : IDL.Nat64,
              'reviewStatus' : IDL.Text,
              'author' : IDL.Principal,
              'timestamp' : IDL.Nat64,
              'abstract' : IDL.Text,
              'citations' : IDL.Vec(IDL.Text),
            }),
            'Err' : IDL.Variant({
              'InvalidInput' : IDL.Text,
              'NotFound' : IDL.Text,
              'NotAuthorized' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
    'getReputation' : IDL.Func([IDL.Principal], [IDL.Nat64], ['query']),
    'listPapers' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'reviews' : IDL.Vec(IDL.Text),
              'votes' : IDL.Nat64,
              'reviewStatus' : IDL.Text,
              'author' : IDL.Principal,
              'timestamp' : IDL.Nat64,
              'abstract' : IDL.Text,
              'citations' : IDL.Vec(IDL.Text),
            })
          ),
        ],
        ['query'],
      ),
    'publishPaper' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'reviews' : IDL.Vec(IDL.Text),
              'votes' : IDL.Nat64,
              'reviewStatus' : IDL.Text,
              'author' : IDL.Principal,
              'timestamp' : IDL.Nat64,
              'abstract' : IDL.Text,
              'citations' : IDL.Vec(IDL.Text),
            }),
            'Err' : IDL.Variant({
              'InvalidInput' : IDL.Text,
              'NotFound' : IDL.Text,
              'NotAuthorized' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'submitReview' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'content' : IDL.Text,
              'timestamp' : IDL.Nat64,
              'paperId' : IDL.Text,
              'rating' : IDL.Nat64,
              'reviewer' : IDL.Principal,
            }),
            'Err' : IDL.Variant({
              'InvalidInput' : IDL.Text,
              'NotFound' : IDL.Text,
              'NotAuthorized' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'votePaper' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'title' : IDL.Text,
              'content' : IDL.Text,
              'reviews' : IDL.Vec(IDL.Text),
              'votes' : IDL.Nat64,
              'reviewStatus' : IDL.Text,
              'author' : IDL.Principal,
              'timestamp' : IDL.Nat64,
              'abstract' : IDL.Text,
              'citations' : IDL.Vec(IDL.Text),
            }),
            'Err' : IDL.Variant({
              'InvalidInput' : IDL.Text,
              'NotFound' : IDL.Text,
              'NotAuthorized' : IDL.Text,
              'AlreadyExists' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
