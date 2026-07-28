export default class SalesResponseBuilder {
  build({
    interaction = "MESSAGE",
    message = "",
    actions = [],
    sections = [],
    liveRequirement = null,
    completed = false,
    workflow = "SALES",
    metadata = {},
    currentStep = null,
    nextStep = null,
  } = {}) {
    return {
      success: true,

      type: "sales",

      workflow,

      interaction,

      message,

      actions,

      sections,

      liveRequirement,

      completed,

      metadata,

      currentStep,

      nextStep,
    };
  }

  error(message = "Something went wrong.") {
    return {
      success: false,

      type: "error",

      message,

      workflow: "SALES",

      interaction: "MESSAGE",

      actions: [],

      sections: [],

      liveRequirement: null,

      completed: false,

      metadata: {},

      currentStep: null,

      nextStep: null,
    };
  }
}
