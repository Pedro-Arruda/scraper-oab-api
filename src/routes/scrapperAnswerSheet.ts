import { Router } from "express";
import { scrapperGabarito } from "../endpoints/scrapperGabarito/scrapperGabarito";

const router = Router();

/**
 * GET /scrapper-answer-sheet
 * @tag Scrapper
 * @response 200
 * @responseContent {Book[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/scrapper-answer-sheet", scrapperGabarito);

export default router;
