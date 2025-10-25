export class CssJSON {
  /**
   * Convert a CSS string into a JSON object.
   * @param cssString - The raw CSS string.
   * @returns A Record where each selector maps to its style declarations.
   */
  static cssToJson(cssString: string): Record<string, Record<string, string>> {
    const cssJson: Record<string, Record<string, string>> = {};

    // Remove comments and trim whitespace
    const cleanCss = cssString.replace(/\/\*[\s\S]*?\*\//g, '').trim();

    // Match selector blocks
    const regex = /([^{]+)\{([^}]+)\}/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(cleanCss)) !== null) {
      const selector = match[1].trim();
      const declarations = match[2].trim().split(';').filter(Boolean);

      const ruleSet: Record<string, string> = {};

      for (const decl of declarations) {
        const [property, value] = decl.split(':').map(s => s.trim());
        if (property && value) {
          ruleSet[property] = value;
        }
      }

      cssJson[selector] = ruleSet;
    }

    return cssJson;
  }

  /**
   * Convert a JSON object back into a CSS string.
   * @param json - The Record representing CSS rules.
   * @returns A CSS string.
   */
  static jsonToCss(json: Record<string, Record<string, string>>): string {
    let cssString = '';

    for (const selector in json) {
      cssString += `${selector} {\n`;
      const rules = json[selector];
      for (const property in rules) {
        cssString += `  ${property}: ${rules[property]};\n`;
      }
      cssString += `}\n\n`;
    }

    return cssString.trim();
  }
}