export const SHARED_CLASSES = `
  px-2
  py-1
  rounded-md
`;
export const CLASS_MAPPING = {
  default: {
    standard: `
      border
      shadow-md
      `,
    enabled: `
      bg-indigo-500
      border-indigo-600
      hover:bg-indigo-600
      hover:border-indigo-700
      text-indigo-50
    `,
    disabled: `
      bg-gray-500
      border-gray-600
      text-gray-50
    `,
  },
  inverted: {
    standard: `
      border-2
      font-medium
      shadow-md
    `,
    enabled: `
      bg-indigo-50
      border-indigo-200
      hover:border-indigo-400
      hover:text-indigo-500
      text-indigo-400
    `,
    disabled: `
      bg-gray-50
      border-gray-200
      text-gray-400
    `,
  },
};
