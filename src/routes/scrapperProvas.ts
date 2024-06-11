import { Router } from "express";
import { scrapperProvas } from "../endpoints/scrapperProvas/scrapperProvas";

const router = Router();

/**
 * GET /scrapper-provas
 * @tag Provas
 * @response 200
 * @responseContent {Book[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get("/scrapper-provas", scrapperProvas);

export default router;
