const addNoteBtn = document.getElementById('addNoteBtn');
const noteModal = document.getElementById('noteModal');
const noteInput = document.getElementById('noteInput');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const charCounter = document.getElementById('charCounter');
const clearAllBtn = document.getElementById('clearAllBtn');
const tagButtons = document.querySelectorAll('.tag-btn');
const searchInput = document.getElementById('searchInput');
const listViewBtn = document.getElementById('listViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const reminderInputWrapper = document.getElementById('reminderInputWrapper');
const reminderDateInput = document.getElementById('reminderDate');

const NOTE_KEY_PREFIX = 's146f-note-';

let currentTag = '';
let notes = [];
let editingKey = null;

function loadNotes() {
  notes = [];
  for (let key in localStorage) {
    if (key.startsWith(NOTE_KEY_PREFIX)) {
      notes.push({
        key,
        content: localStorage.getItem(key)
      });
    }
  }
  notes.sort((a, b) => a.key.localeCompare(b.key));
  renderNotes();
}

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = note.content;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✖';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      localStorage.removeItem(note.key);
      loadNotes();
    };

    card.onclick = () => editNote(note.key, note.content);
    card.appendChild(delBtn);
    notesContainer.appendChild(card);
  });
  notesContainer.scrollTop = notesContainer.scrollHeight;
}

function openModal() {
  noteModal.classList.remove('hidden');
  noteInput.focus();
}

function closeModal() {
  noteModal.classList.add('hidden');
  noteInput.value = '';
  charCounter.textContent = '0 / 200';
  currentTag = '';
  reminderDateInput.value = '';
  reminderInputWrapper.classList.add('hidden');
  editingKey = null;
}

function saveNote() {
  let content = noteInput.value.trim();
  if (currentTag) content = currentTag + ' ' + content;
  if (reminderDateInput.value) content += `<br><small>🗓 ${new Date(reminderDateInput.value).toLocaleString()}</small>`;
  if (!content.trim()) return;
  const key = editingKey || NOTE_KEY_PREFIX + Date.now();
  localStorage.setItem(key, content);
  closeModal();
  loadNotes();
}

function editNote(key, content) {
  editingKey = key;
  noteInput.value = content.replace(/<br>.*$/, '').replace(/^([\u{1F4A1}\u{1F4CC}\u{23F0}])\s/u, '');
  currentTag = content.match(/^([\u{1F4A1}\u{1F4CC}\u{23F0}])\s/u)?.[1] || '';
  if (currentTag === '⏰') {
    reminderInputWrapper.classList.remove('hidden');
  } else {
    reminderInputWrapper.classList.add('hidden');
  }
  charCounter.textContent = `${noteInput.value.length} / 200`;
  openModal();
}

addNoteBtn.onclick = openModal;
cancelNoteBtn.onclick = closeModal;
saveNoteBtn.onclick = saveNote;

noteInput.addEventListener('input', () => {
  charCounter.textContent = `${noteInput.value.length} / 200`;
});

tagButtons.forEach(btn => {
  btn.onclick = () => {
    currentTag = btn.dataset.tag;
    if (currentTag === '⏰') {
      reminderInputWrapper.classList.remove('hidden');
    } else {
      reminderInputWrapper.classList.add('hidden');
    }
    noteInput.focus();
  };
});

clearAllBtn.onclick = () => {
  for (let key in localStorage) {
    if (key.startsWith(NOTE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
  loadNotes();
};

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const cards = notesContainer.querySelectorAll('.note-card');
  cards.forEach(card => {
    const visible = card.textContent.toLowerCase().includes(query);
    card.style.display = visible ? 'block' : 'none';
  });
});

listViewBtn.onclick = () => {
  notesContainer.classList.remove('grid-view');
  notesContainer.classList.add('list-view');
  listViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
};

gridViewBtn.onclick = () => {
  notesContainer.classList.remove('list-view');
  notesContainer.classList.add('grid-view');
  gridViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
};

window.addEventListener('DOMContentLoaded', () => {
  loadNotes();
});