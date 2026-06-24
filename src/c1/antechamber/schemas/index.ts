export const c1SrcSchemaRegistry = {
  storage_relation: {
    file: "c1_SRC_storage_relation.yaml",
    schema_name: "storage_relation",
    intake_class: "c1_SRC",
    stage: "antechamber",
    validator: "notchazz",
    passage_required: true,
    tags: [
      "c1",
      "src",
      "storage",
      "antechamber",
      "institution",
      "required",
      "continuity",
      "protected-storage",
    ],
  },

  system_relation: {
    file: "c1_SRC_system_relation.yaml",
    schema_name: "system_relation",
    intake_class: "c1_SRC",
    stage: "antechamber",
    validator: "notchazz",
    passage_required: true,
    tags: [
      "c1",
      "src",
      "system",
      "antechamber",
      "institution",
      "required",
      "mapping",
      "authority",
      "role-boundary",
    ],
  },
} as const;

export type C1SrcSchemaName = keyof typeof c1SrcSchemaRegistry;

export function getC1SrcSchema(name: C1SrcSchemaName) {
  return c1SrcSchemaRegistry[name];
}

export function listC1SrcSchemas() {
  return Object.values(c1SrcSchemaRegistry);
}

export function listC1SrcSchemaFiles() {
  return Object.values(c1SrcSchemaRegistry).map((schema) => schema.file);
}