#!/usr/bin/env node

/**
 * Zaarvy Skills Validator & Registry Synchronizer
 * Zero-dependency Node.js script to validate Agent Skills and registry specs.
 *
 * Usage:
 *   node scripts/verify-skills.js          # Validate all skills and verify registry sync
 *   node scripts/verify-skills.js --sync   # Validate all skills and regenerate registry.json
 *   node scripts/verify-skills.js --skill <name>  # Validate specific skill
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT_DIR, 'skills');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry.json');

const REQUIRED_SECTIONS = [
  '## Skill Purpose',
  '## Trigger Conditions',
  '## Execution Protocol',
  '## Constraints',
  '## Output Contract'
];

const VALID_CATEGORIES = [
  'optimization',
  'code-analysis',
  'mocking',
  'testing',
  'security',
  'scaffolding'
];

// Lightweight zero-dependency YAML frontmatter parser
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: null, body: content };
  }

  const rawYaml = match[1];
  const body = match[2];
  const lines = rawYaml.split(/\r?\n/);
  const data = {};
  let currentKey = null;
  let currentSubKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Sub-item in nested object (indented with spaces)
    if (/^\s{2,}/.test(line)) {
      const trimmed = line.trim();
      if (!currentKey) continue;

      if (typeof data[currentKey] !== 'object' || Array.isArray(data[currentKey])) {
        data[currentKey] = {};
      }

      // Check key: value inside nested object
      const subMatch = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (subMatch) {
        currentSubKey = subMatch[1];
        let val = subMatch[2].trim();
        if (val.startsWith('[') && val.endsWith(']')) {
          try {
            data[currentKey][currentSubKey] = JSON.parse(val);
          } catch {
            data[currentKey][currentSubKey] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          }
        } else if (val) {
          data[currentKey][currentSubKey] = val.replace(/^['"]|['"]$/g, '');
        } else {
          data[currentKey][currentSubKey] = [];
        }
      } else if (trimmed.startsWith('-') && currentSubKey) {
        // List item inside nested object
        const itemVal = trimmed.replace(/^-\s*/, '').replace(/^['"]|['"]$/g, '');
        if (!Array.isArray(data[currentKey][currentSubKey])) {
          data[currentKey][currentSubKey] = [];
        }
        data[currentKey][currentSubKey].push(itemVal);
      }
      continue;
    }

    // Top-level line
    currentSubKey = null;
    const topMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topMatch) {
      currentKey = topMatch[1];
      let val = topMatch[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          data[currentKey] = JSON.parse(val);
        } catch {
          data[currentKey] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        }
      } else if (val === '' || val === '>-' || val === '|') {
        data[currentKey] = {};
      } else {
        data[currentKey] = val.replace(/^['"]|['"]$/g, '');
      }
    } else if (line.trim().startsWith('-') && currentKey) {
      const itemVal = line.trim().replace(/^-\s*/, '').replace(/^['"]|['"]$/g, '');
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(itemVal);
    }
  }

  return { frontmatter: data, body };
}

function validateSkillDir(dirName) {
  const errors = [];
  const skillPath = path.join(SKILLS_DIR, dirName);
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    return {
      name: dirName,
      valid: false,
      errors: [`Missing SKILL.md in directory: skills/${dirName}`]
    };
  }

  const rawContent = fs.readFileSync(skillMdPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(rawContent);

  if (!frontmatter) {
    errors.push('SKILL.md lacks valid YAML frontmatter delimiters (---)');
    return { name: dirName, valid: false, errors };
  }

  // 1. Name validation
  if (!frontmatter.name) {
    errors.push("Missing 'name' field in frontmatter");
  } else {
    if (frontmatter.name !== dirName) {
      errors.push(`Name in frontmatter ('${frontmatter.name}') does not match directory name ('${dirName}')`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(frontmatter.name)) {
      errors.push(`Name '${frontmatter.name}' must be lowercase alphanumeric with single hyphens`);
    }
    if (frontmatter.name.length < 1 || frontmatter.name.length > 64) {
      errors.push(`Name length (${frontmatter.name.length}) must be between 1 and 64 characters`);
    }
  }

  // 2. Description validation
  if (!frontmatter.description) {
    errors.push("Missing 'description' field in frontmatter");
  } else if (frontmatter.description.length < 10 || frontmatter.description.length > 1024) {
    errors.push(`Description length (${frontmatter.description.length}) must be between 10 and 1024 characters`);
  }

  // 3. Category validation
  const category = frontmatter.category;
  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category '${category}' is invalid. Allowed: ${VALID_CATEGORIES.join(', ')}`);
  }

  // 4. Required Body Sections validation
  for (const section of REQUIRED_SECTIONS) {
    if (!body.includes(section)) {
      errors.push(`Missing required body section: "${section}"`);
    }
  }

  return {
    name: dirName,
    valid: errors.length === 0,
    errors,
    metadata: {
      name: frontmatter.name || dirName,
      description: frontmatter.description || '',
      category: category || 'optimization',
      path: `skills/${dirName}`,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [category].filter(Boolean)
    }
  };
}

function run() {
  const args = process.argv.slice(2);
  const isSync = args.includes('--sync');
  const skillArgIndex = args.indexOf('--skill');
  const targetSkill = skillArgIndex !== -1 ? args[skillArgIndex + 1] : null;

  console.log('\x1b[36m%s\x1b[0m', '══════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[35m%s\x1b[0m', '  ⚡ Zaarvy Skills Ecosystem Validator');
  console.log('\x1b[36m%s\x1b[0m', '══════════════════════════════════════════════════════\n');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('\x1b[33m%s\x1b[0m', `Skills directory not found at ${SKILLS_DIR}. Creating...`);
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
  }

  let skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (targetSkill) {
    skillDirs = skillDirs.filter(d => d === targetSkill);
    if (skillDirs.length === 0) {
      console.error(`\x1b[31mError: Target skill '${targetSkill}' not found in skills/ directory.\x1b[0m`);
      process.exit(1);
    }
  }

  if (skillDirs.length === 0) {
    console.log('\x1b[33m%s\x1b[0m', 'No skill directories found in skills/. Ready for first skill.');
    if (isSync) {
      const initialRegistry = {
        version: "1.0.0",
        updated_at: new Date().toISOString(),
        skills: []
      };
      fs.writeFileSync(REGISTRY_PATH, JSON.stringify(initialRegistry, null, 2) + '\n');
      console.log('\x1b[32m%s\x1b[0m', '✓ Initialized empty registry.json');
    }
    process.exit(0);
  }

  let allValid = true;
  const verifiedSkills = [];

  for (const dirName of skillDirs) {
    const result = validateSkillDir(dirName);
    if (result.valid) {
      console.log(`\x1b[32m✔ [PASS]\x1b[0m \x1b[1m${result.name}\x1b[0m`);
      console.log(`         Category: \x1b[34m${result.metadata.category}\x1b[0m | Tags: [${result.metadata.tags.join(', ')}]`);
      console.log(`         Path: \x1b[90m${result.metadata.path}\x1b[0m`);
      verifiedSkills.push(result.metadata);
    } else {
      allValid = false;
      console.log(`\x1b[31m✖ [FAIL]\x1b[0m \x1b[1m${result.name}\x1b[0m`);
      for (const err of result.errors) {
        console.log(`         \x1b[31m↳ ${err}\x1b[0m`);
      }
    }
    console.log('');
  }

  // Registry check / sync
  if (isSync) {
    if (!allValid) {
      console.error('\x1b[31mCannot synchronize registry.json while validation errors exist.\x1b[0m');
      process.exit(1);
    }

    const registryData = {
      version: "1.0.0",
      updated_at: new Date().toISOString(),
      skills: verifiedSkills
    };

    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registryData, null, 2) + '\n');
    console.log('\x1b[32m%s\x1b[0m', `✓ Successfully synchronized registry.json with ${verifiedSkills.length} skill(s).`);
  } else if (!targetSkill) {
    if (!fs.existsSync(REGISTRY_PATH)) {
      console.log('\x1b[31m✖ registry.json does not exist. Run with --sync to generate it.\x1b[0m');
      allValid = false;
    } else {
      try {
        const currentRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
        const regNames = new Set((currentRegistry.skills || []).map(s => s.name));
        const discNames = new Set(verifiedSkills.map(s => s.name));

        const missingInReg = [...discNames].filter(x => !regNames.has(x));
        const extraInReg = [...regNames].filter(x => !discNames.has(x));

        if (missingInReg.length > 0) {
          console.log(`\x1b[31m✖ Skills missing from registry.json: ${missingInReg.join(', ')}\x1b[0m`);
          allValid = false;
        }
        if (extraInReg.length > 0) {
          console.log(`\x1b[31m✖ registry.json contains skills not found on disk: ${extraInReg.join(', ')}\x1b[0m`);
          allValid = false;
        }
        if (missingInReg.length === 0 && extraInReg.length === 0 && allValid) {
          console.log('\x1b[32m✓ registry.json is fully synchronized with disk.\x1b[0m');
        }
      } catch (err) {
        console.log(`\x1b[31m✖ Failed to parse registry.json: ${err.message}\x1b[0m`);
        allValid = false;
      }
    }
  }

  console.log('\n\x1b[36m%s\x1b[0m', '──────────────────────────────────────────────────────');
  if (allValid) {
    console.log('\x1b[32m\x1b[1m%s\x1b[0m', `✨ All verification checks passed (${verifiedSkills.length} verified).`);
    process.exit(0);
  } else {
    console.log('\x1b[31m\x1b[1m%s\x1b[0m', '💥 Validation failed. Please address errors listed above.');
    process.exit(1);
  }
}

run();
