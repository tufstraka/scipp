import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'citePaper' : ActorMethod<
    [string, string],
    {
        'Ok' : {
          'id' : string,
          'title' : string,
          'content' : string,
          'reviews' : Array<string>,
          'votes' : bigint,
          'reviewStatus' : string,
          'author' : Principal,
          'timestamp' : bigint,
          'abstract' : string,
          'citations' : Array<string>,
        }
      } |
      {
        'Err' : { 'InvalidInput' : string } |
          { 'NotFound' : string } |
          { 'NotAuthorized' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'getAuthorPapers' : ActorMethod<
    [Principal],
    Array<
      {
        'id' : string,
        'title' : string,
        'content' : string,
        'reviews' : Array<string>,
        'votes' : bigint,
        'reviewStatus' : string,
        'author' : Principal,
        'timestamp' : bigint,
        'abstract' : string,
        'citations' : Array<string>,
      }
    >
  >,
  'getPaper' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'title' : string,
          'content' : string,
          'reviews' : Array<string>,
          'votes' : bigint,
          'reviewStatus' : string,
          'author' : Principal,
          'timestamp' : bigint,
          'abstract' : string,
          'citations' : Array<string>,
        }
      } |
      {
        'Err' : { 'InvalidInput' : string } |
          { 'NotFound' : string } |
          { 'NotAuthorized' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'getReputation' : ActorMethod<[Principal], bigint>,
  'listPapers' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'title' : string,
        'content' : string,
        'reviews' : Array<string>,
        'votes' : bigint,
        'reviewStatus' : string,
        'author' : Principal,
        'timestamp' : bigint,
        'abstract' : string,
        'citations' : Array<string>,
      }
    >
  >,
  'publishPaper' : ActorMethod<
    [string, string, string],
    {
        'Ok' : {
          'id' : string,
          'title' : string,
          'content' : string,
          'reviews' : Array<string>,
          'votes' : bigint,
          'reviewStatus' : string,
          'author' : Principal,
          'timestamp' : bigint,
          'abstract' : string,
          'citations' : Array<string>,
        }
      } |
      {
        'Err' : { 'InvalidInput' : string } |
          { 'NotFound' : string } |
          { 'NotAuthorized' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'submitReview' : ActorMethod<
    [string, string, bigint],
    {
        'Ok' : {
          'id' : string,
          'content' : string,
          'timestamp' : bigint,
          'paperId' : string,
          'rating' : bigint,
          'reviewer' : Principal,
        }
      } |
      {
        'Err' : { 'InvalidInput' : string } |
          { 'NotFound' : string } |
          { 'NotAuthorized' : string } |
          { 'AlreadyExists' : string }
      }
  >,
  'votePaper' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'title' : string,
          'content' : string,
          'reviews' : Array<string>,
          'votes' : bigint,
          'reviewStatus' : string,
          'author' : Principal,
          'timestamp' : bigint,
          'abstract' : string,
          'citations' : Array<string>,
        }
      } |
      {
        'Err' : { 'InvalidInput' : string } |
          { 'NotFound' : string } |
          { 'NotAuthorized' : string } |
          { 'AlreadyExists' : string }
      }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
