export interface TrustSignal {
  index: string;
  layer: "Institutional" | "Operational" | "Experiential";
  title: string;
  description: string;
  trustProduced: string;
  source: string;
  dependsOn: string[];
  enables: string[];
  makesVisible: string;
  audience: {
    endUser: boolean;
    internalStaff: boolean;
    organisation: boolean;
  };
}

function parseRefs(raw: string): string[] {
  if (!raw || raw === "—") return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export const trustSignals: TrustSignal[] = [
  // Institutional
  { index: "I-1", layer: "Institutional", title: "Governance approval process", description: "Formal validation before deployment", trustProduced: "Legitimacy", source: "Workshop #1, NIST AI RMF, ISO 42001", dependsOn: ["I-12"], enables: ["O-1", "O-4"], makesVisible: "Accountability", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-2", layer: "Institutional", title: "AI ownership & responsibility clarity", description: "Defined ownership of AI decisions and systems", trustProduced: "Accountability", source: "Workshop #1, ISO 42001", dependsOn: ["I-1"], enables: ["O-5", "O-6"], makesVisible: "Responsibility distribution", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-3", layer: "Institutional", title: "Audit trail & activity log", description: "Logging of inputs, outputs, decisions", trustProduced: "Traceability", source: "Workshop #1, NIST AI RMF, ISO 42001", dependsOn: ["I-4"], enables: ["O-2", "O-7"], makesVisible: "Decision history", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-4", layer: "Institutional", title: "Model lifecycle documentation", description: "Documentation of purpose, limits, updates", trustProduced: "Transparency", source: "Workshop #1, NIST AI RMF, ISO 42001", dependsOn: ["I-12"], enables: ["O-1", "E-4"], makesVisible: "System intelligibility", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-5", layer: "Institutional", title: "AI system inventory", description: "List of AI systems in use", trustProduced: "Visibility", source: "ISO 42001", dependsOn: [], enables: ["I-1", "I-4"], makesVisible: "Deployment footprint", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-6", layer: "Institutional", title: "Incident management process", description: "Detection, reporting and resolution of issues", trustProduced: "Resilience", source: "ISO 42001, Workshop #2", dependsOn: ["I-3"], enables: ["O-3", "E-5"], makesVisible: "Failure handling", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-7", layer: "Institutional", title: "Formal AI communication protocol", description: "Communication of AI use and limits", trustProduced: "Alignment", source: "ISO 42001, IF, Google AI Guidebook", dependsOn: ["I-1"], enables: ["E-2", "E-3"], makesVisible: "Organisational intent", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "I-8", layer: "Institutional", title: "Risk assessment & treatment", description: "Identification and mitigation of AI risks", trustProduced: "Risk awareness", source: "NIST AI RMF, ISO 42001", dependsOn: ["I-5"], enables: ["I-1", "O-4"], makesVisible: "Risk posture", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-9", layer: "Institutional", title: "Data governance transparency", description: "Rules on data sourcing and usage", trustProduced: "Fairness, reliability", source: "NIST AI RMF, ISO 42001", dependsOn: ["I-5"], enables: ["O-8", "E-2"], makesVisible: "Data integrity", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "I-10", layer: "Institutional", title: "Supplier / model governance", description: "Control over external AI providers", trustProduced: "Independence", source: "ISO 42001", dependsOn: ["I-8"], enables: ["O-1"], makesVisible: "Dependency structure", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "I-11", layer: "Institutional", title: "Compliance disclosure", description: "Explicit declaration of AI usage", trustProduced: "Transparency", source: "Workshop #1, GovStack", dependsOn: ["I-7"], enables: ["E-2"], makesVisible: "AI presence", audience: { endUser: true, internalStaff: false, organisation: true } },
  { index: "I-12", layer: "Institutional", title: "Scope definition (AI boundaries)", description: "Definition of what AI does vs not", trustProduced: "Predictability", source: "Workshop #1, Google AI Guidebook", dependsOn: [], enables: ["I-1", "I-4"], makesVisible: "System boundaries", audience: { endUser: true, internalStaff: true, organisation: true } },

  // Operational
  { index: "O-1", layer: "Operational", title: "Controlled model / prompt update process", description: "Structured updates and validation", trustProduced: "Stability", source: "ISO 42001, Workshop #1", dependsOn: ["I-1", "I-4"], enables: ["O-2"], makesVisible: "Change control", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "O-2", layer: "Operational", title: "Centralised back-testing", description: "Testing model on historical data", trustProduced: "Reliability", source: "Workshop #1, NIST AI RMF", dependsOn: ["I-3", "O-1"], enables: ["E-1"], makesVisible: "Performance evolution", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "O-3", layer: "Operational", title: "QA sampling routines", description: "Regular review of outputs", trustProduced: "Quality assurance", source: "Workshop #1", dependsOn: ["I-6", "I-3"], enables: ["O-2"], makesVisible: "Quality consistency", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "O-4", layer: "Operational", title: "Production-like testing environment", description: "Testing in realistic conditions", trustProduced: "Safety", source: "Workshop #1, NIST AI RMF", dependsOn: ["I-1", "I-8"], enables: ["O-1"], makesVisible: "Robustness", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "O-5", layer: "Operational", title: "Decision tagging (AI vs human)", description: "Identification of decision source", trustProduced: "Clarity of agency", source: "Workshop #1, GovStack", dependsOn: ["I-2"], enables: ["O-6", "E-3"], makesVisible: "Human–AI boundary", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "O-6", layer: "Operational", title: "Human override mechanism", description: "Ability for humans to intervene", trustProduced: "Control", source: "Workshop #1", dependsOn: ["I-2", "O-5"], enables: ["O-7", "E-3"], makesVisible: "Human authority", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "O-7", layer: "Operational", title: "Rationale tracking", description: "Recording reasoning behind decisions", trustProduced: "Explainability", source: "Workshop #1, NIST AI RMF", dependsOn: ["I-3", "O-6"], enables: ["E-2"], makesVisible: "Decision justification", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "O-8", layer: "Operational", title: "Data/API AI-readiness", description: "Structuring data for AI consumption", trustProduced: "Reliability", source: "GovStack", dependsOn: ["I-9"], enables: ["O-4"], makesVisible: "Data operability", audience: { endUser: false, internalStaff: true, organisation: true } },
  { index: "O-9", layer: "Operational", title: "Escalation pathways", description: "Defined path for complex cases", trustProduced: "Safety", source: "IF, Google AI Guidebook, Workshop #2", dependsOn: ["O-5"], enables: ["O-6"], makesVisible: "Risk handling", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "O-10", layer: "Operational", title: "Task scoping (low-risk automation first)", description: "Limiting AI to safe use cases", trustProduced: "Risk containment", source: "Workshop #1", dependsOn: ["I-12"], enables: ["O-4"], makesVisible: "Safe automation scope", audience: { endUser: true, internalStaff: true, organisation: true } },

  // Experiential
  { index: "E-1", layer: "Experiential", title: "Confidence indicators", description: "Display of uncertainty levels", trustProduced: "Calibrated trust", source: "Google AI Guidebook", dependsOn: ["O-2"], enables: [], makesVisible: "System uncertainty", audience: { endUser: true, internalStaff: true, organisation: false } },
  { index: "E-2", layer: "Experiential", title: "Error / explanation messages", description: "Explanation of decisions and failures", trustProduced: "Transparency", source: "Workshop #1, IF, Google AI Guidebook", dependsOn: ["O-7", "I-7"], enables: [], makesVisible: "System limits", audience: { endUser: true, internalStaff: true, organisation: false } },
  { index: "E-3", layer: "Experiential", title: "Visible human-in-the-loop", description: "Explicit human oversight", trustProduced: "Reassurance", source: "Workshop #1, IF", dependsOn: ["O-5", "O-6", "I-7"], enables: ["Adoption"], makesVisible: "Human oversight", audience: { endUser: true, internalStaff: true, organisation: false } },
  { index: "E-4", layer: "Experiential", title: "Process visibility", description: "Transparency of workflow steps", trustProduced: "Predictability", source: "Workshop #2, Service design", dependsOn: ["I-4"], enables: [], makesVisible: "System functioning", audience: { endUser: true, internalStaff: true, organisation: false } },
  { index: "E-5", layer: "Experiential", title: "User feedback loops", description: "Mechanism for user input", trustProduced: "Participation", source: "IF, Google AI Guidebook", dependsOn: ["I-6"], enables: ["Continuous improvement"], makesVisible: "User agency", audience: { endUser: true, internalStaff: true, organisation: true } },
  { index: "E-6", layer: "Experiential", title: "Progressive disclosure", description: "Gradual reveal of complexity", trustProduced: "Cognitive trust", source: "Google AI Guidebook", dependsOn: ["E-4"], enables: ["E-2"], makesVisible: "Explainability", audience: { endUser: true, internalStaff: true, organisation: false } },
  { index: "E-7", layer: "Experiential", title: "Capability & limitation display", description: "Explanation of what AI can/cannot do", trustProduced: "Expectation alignment", source: "Workshop #1, IF", dependsOn: ["I-12"], enables: ["E-2"], makesVisible: "System boundaries", audience: { endUser: true, internalStaff: true, organisation: false } },
];
