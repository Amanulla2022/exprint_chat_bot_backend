import RecommendationAgent from "../../agents/RecommendationAgent.js";

const ecommendationAgent = new RecommendationAgent();

export default class RecommendationNode {
  async execute(state) {
    // console.log("RecommendationNode Executed");

    return RecommendationAgent.execute(state);
  }
}
