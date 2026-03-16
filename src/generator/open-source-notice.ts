import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates OPEN_SOURCE_NOTICE.md — attribution notices and license text summaries
 * for all open-source dependencies detected by the license scanner.
 *
 * Generated when the license scanner finds OSS dependencies.
 */
export function generateOpenSourceNotice(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (!scan.licenseScan) return null;

  const { dependencies, projectLicense, copyleftDependencies, warnings } = scan.licenseScan;

  // Need at least some dependencies to generate the notice
  if (dependencies.length === 0 && !projectLicense) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];
  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  sections.push(`# Open Source Notice`);
  sections.push(``);
  sections.push(`**Last Updated:** ${date}`);
  sections.push(``);
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(``);
  sections.push(`---`);
  sections.push(``);

  // 1. Introduction
  sections.push(`## ${nextSection()}. Introduction`);
  sections.push(``);
  sections.push(
    `This document provides attribution notices and license information for the ` +
    `open-source software components used in ${scan.projectName}. ${company} is ` +
    `committed to complying with the terms of all open-source licenses.`,
  );
  sections.push(``);

  if (projectLicense) {
    sections.push(`This project itself is licensed under: **${projectLicense}**`);
    sections.push(``);
  }

  // 2. Summary
  sections.push(`## ${nextSection()}. License Summary`);
  sections.push(``);

  // Group dependencies by license type
  const licenseGroups = new Map<string, { package: string; version: string; license: string; isCopyleft: boolean }[]>();
  for (const dep of dependencies) {
    const key = dep.license || "Unknown";
    if (!licenseGroups.has(key)) licenseGroups.set(key, []);
    licenseGroups.get(key)!.push(dep);
  }

  // Sort by count descending
  const sortedLicenses = [...licenseGroups.entries()].sort((a, b) => b[1].length - a[1].length);

  sections.push(`| License | Count | Copyleft |`);
  sections.push(`|---------|-------|----------|`);
  for (const [license, deps] of sortedLicenses) {
    const isCopyleft = deps.some((d) => d.isCopyleft);
    sections.push(`| ${license} | ${deps.length} | ${isCopyleft ? "Yes" : "No"} |`);
  }
  sections.push(``);
  sections.push(`**Total open-source dependencies:** ${dependencies.length}`);
  sections.push(``);

  // 3. Copyleft Warning
  if (copyleftDependencies.length > 0) {
    sections.push(`## ${nextSection()}. Copyleft Dependencies`);
    sections.push(``);
    sections.push(
      `The following dependencies use copyleft licenses that require derivative works ` +
      `to be distributed under the same license terms. Ensure your distribution ` +
      `model complies with these obligations.`,
    );
    sections.push(``);
    sections.push(`| Package | Version | License |`);
    sections.push(`|---------|---------|---------|`);
    for (const dep of copyleftDependencies) {
      sections.push(`| ${dep.package} | ${dep.version} | **${dep.license}** |`);
    }
    sections.push(``);

    sections.push(`### ${sectionNum}.1 Copyleft Compliance Requirements`);
    sections.push(``);
    sections.push(`For each copyleft dependency, you must:`);
    sections.push(``);
    sections.push(`- Make the source code of copyleft components available to recipients`);
    sections.push(`- Include the full license text with distributions`);
    sections.push(`- Clearly mark any modifications you made to the original source`);
    sections.push(`- Not impose additional restrictions beyond the license terms`);
    sections.push(``);
  }

  // 4. Attribution Notices
  sections.push(`## ${nextSection()}. Attribution Notices`);
  sections.push(``);
  sections.push(
    `The following open-source packages are used in this project. Each package ` +
    `is listed with its version and license.`,
  );
  sections.push(``);

  // Group by license for cleaner display
  for (const [license, deps] of sortedLicenses) {
    sections.push(`### ${license}`);
    sections.push(``);
    sections.push(`The following packages are licensed under ${license}:`);
    sections.push(``);

    // Table for packages under this license
    sections.push(`| Package | Version |`);
    sections.push(`|---------|---------|`);
    for (const dep of deps.sort((a, b) => a.package.localeCompare(b.package))) {
      sections.push(`| ${dep.package} | ${dep.version} |`);
    }
    sections.push(``);

    // License text summary
    const licenseText = getLicenseSummary(license);
    if (licenseText) {
      sections.push(`<details>`);
      sections.push(`<summary>License text summary</summary>`);
      sections.push(``);
      sections.push(licenseText);
      sections.push(``);
      sections.push(`</details>`);
      sections.push(``);
    }
  }

  // 5. Warnings
  if (warnings.length > 0) {
    sections.push(`## ${nextSection()}. Warnings`);
    sections.push(``);
    sections.push(`The license scanner produced the following warnings:`);
    sections.push(``);
    for (const warning of warnings) {
      sections.push(`- ${warning}`);
    }
    sections.push(``);
  }

  // 6. How to Obtain Source
  sections.push(`## ${nextSection()}. Obtaining Source Code`);
  sections.push(``);
  sections.push(
    `For open-source components where the license requires source code availability, ` +
    `you may obtain the source code by:`
  );
  sections.push(``);
  sections.push(`1. Visiting the package's repository on npm, PyPI, or the relevant package registry`);
  sections.push(`2. Contacting ${contactEmail} with a written request`);
  sections.push(``);
  sections.push(
    `Source code requests will be fulfilled within 30 days at no charge beyond ` +
    `the cost of distribution.`,
  );
  sections.push(``);

  // 7. Your Obligations
  sections.push(`## ${nextSection()}. Your Obligations`);
  sections.push(``);
  sections.push(`If you redistribute this software, you must:`);
  sections.push(``);
  sections.push(`- Include this OPEN_SOURCE_NOTICE.md file`);
  sections.push(`- Comply with the license terms for each component`);
  sections.push(`- Preserve all copyright notices and license headers`);
  sections.push(`- For copyleft components, make source code available as required`);
  sections.push(``);

  // 8. Contact
  sections.push(`## ${nextSection()}. Contact`);
  sections.push(``);
  sections.push(`For questions about open-source licensing or to request source code:`);
  sections.push(``);
  sections.push(`- **Email:** ${contactEmail}`);
  sections.push(``);

  // Footer
  sections.push(`---`);
  sections.push(``);
  sections.push(
    `*Generated by Codepliant from dependency analysis. This document is auto-generated ` +
    `and should be regenerated when dependencies change. Review with legal counsel ` +
    `for copyleft compliance.*`,
  );
  sections.push(``);

  return sections.join("\n");
}

/**
 * Provides a brief summary of common open-source licenses.
 */
function getLicenseSummary(license: string): string | null {
  const summaries: Record<string, string> = {
    MIT: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.`,

    "Apache-2.0": `Licensed under the Apache License, Version 2.0. You may use, reproduce, and distribute the software, with or without modification, provided you include a copy of the license, state significant changes made, and include the NOTICE file if one exists. The license also provides an express grant of patent rights from contributors.`,

    "BSD-2-Clause": `Redistribution and use in source and binary forms, with or without modification, are permitted provided that: (1) Redistributions of source code retain the copyright notice, this list of conditions, and the disclaimer. (2) Redistributions in binary form reproduce the same in the documentation.`,

    "BSD-3-Clause": `Redistribution and use in source and binary forms, with or without modification, are permitted provided that: (1) Source redistributions retain the copyright notice. (2) Binary redistributions reproduce the notice. (3) Neither the name of the copyright holder nor contributors may be used to endorse derived products without permission.`,

    ISC: `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies. THE SOFTWARE IS PROVIDED "AS IS".`,

    "GPL-2.0": `This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License version 2. Any distributed modifications must also be licensed under GPL-2.0 and include source code.`,

    "GPL-3.0": `This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3. Distributed modifications must also be licensed under GPL-3.0. Additional protections against tivoization and patent claims apply.`,

    "AGPL-3.0": `This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License version 3. If you run a modified version on a server and let users interact with it, you must provide the source code to those users.`,

    "LGPL-2.1": `This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License version 2.1. You may link to this library from proprietary software, but modifications to the library itself must be released under LGPL.`,

    "MPL-2.0": `This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. Modifications to MPL-covered files must be released under MPL-2.0, but you may combine MPL code with proprietary code in a "Larger Work".`,

    Unlicense: `This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, for any purpose, commercial or non-commercial, and by any means.`,

    "0BSD": `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted. No conditions or restrictions apply.`,
  };

  // Normalize license name for lookup
  const normalized = license
    .replace(/-only$/, "")
    .replace(/-or-later$/, "");

  return summaries[license] || summaries[normalized] || null;
}
