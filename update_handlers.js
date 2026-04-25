const axios = require('axios');
const fs = require('fs');
const path = require('path');

const cardsDir = path.join(process.cwd(), 'db', 'cards');
const handlers = {
  'ancient_scholar': 'return_rainbow_discard',
  'archer_dan': 'destroy_building',
  'big_foot': 'flip_facedown',
  'dragon_claw': 'move_creature',
  'embarrassing_bard': 'draw_per_flooped',
  'heavenly_gazer': 'spell_from_discard',
  'patchy_the_pumpkin': 'damage_per_landscae',
  'schoolhouse': 'copy_floop',
  'the_pig': 'flip_facedown',
  'woad_mobile_home': 'move_adjacent',
};

const enterHandlers = {
  'cornataur': 'damage_per_landscape',
  'husker_worm': 'flip_facedown',
  'legion_of_earlings': 'return_creature',
  'psionic_architect': 'ready_flooped',
  'field_reaper': 'move_creature',
};

function toFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

const files = fs.readdirSync(cardsDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const cardPath = path.join(cardsDir, file);
  const data = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
  
  let components = data.components || [];
  let changed = false;
  
  // Add floop handler
  if (handlers[data.id]) {
    if (!components.includes('floop_component')) {
      components.push('floop_component');
    }
    if (!components.some(c => typeof c === 'object' && c.type === 'floop_handler_component')) {
      components.push({ type: 'floop_handler_component', handler: handlers[data.id] });
      changed = true;
    }
  }
  
  // Add enter play handler
  if (enterHandlers[data.id]) {
    if (!components.includes('enter_play_trigger_component')) {
      components.push('enter_play_trigger_component');
    }
    if (!components.some(c => typeof c === 'object' && c.type === 'enter_play_handler_component')) {
      components.push({ type: 'enter_play_handler_component', handler: enterHandlers[data.id] });
      changed = true;
    }
  }
  
  if (changed) {
    data.components = components;
    fs.writeFileSync(cardPath, JSON.stringify(data, null, 2) + '\n');
    console.log(data.id + ': updated');
  }
}
console.log('Done');