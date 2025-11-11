import { Router } from 'express';
import {
  getActiveChallenges,
  getFinishedChallenges,
  getContestChallenges,
  submitContest,
  getSpecificChallenge,
  submitChallenge,
  getContestLeaderboard,
} from '../controllers/contest.controller.js';

const router: Router = Router();

// Return all the active challenges
router.route('/active').get(getActiveChallenges);

// Return all the finished challenges
router.route('/finished').get(getFinishedChallenges);

// Return all sub challenges and their start timings
router.route('/:contestId').get(getContestChallenges);

// Submit the contest with number of problems/challenge solved
router.route('/submit/:contestId').post(submitContest);

// Return the specific challenge
router.route('/:contestId/:challengeId').get(getSpecificChallenge);

// Submit a specific challenge
router.route('/submit/:challengeId').post(submitChallenge);

// Return the leaderboard from db if the contest is end otherwise from sorted sets
router.route('/leaderboard/:contestId').get(getContestLeaderboard);

export default router;
