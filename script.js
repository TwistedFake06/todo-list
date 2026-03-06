* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #0f0f17;
  color: #e2e8f0;
  min-height: 100vh;
  padding: 20px 12px;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  background: #1a1f2e;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  border: 1px solid #2d3748;
}

h1 {
  text-align: center;
  margin-bottom: 28px;
  color: #f1f5f9;
  font-size: 2rem;
  font-weight: 700;
}

#date {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: 400;
}

.input-area {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

#taskInput {
  flex: 1;
  padding: 14px 18px;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 1.05rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

#taskInput:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

#addBtn {
  padding: 0 28px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

#addBtn:hover {
  background: #6d28d9;
}

#addBtn:active {
  transform: scale(0.98);
}

ul {
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: #242a3b;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #334155;
  transition: all 0.2s;
  font-size: 1.05rem;
}

li.completed {
  background: #1e293b;
  text-decoration: line-through;
  color: #94a3b8;
  opacity: 0.9;
  border-color: #334155;
}

li input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #7c3aed;
  cursor: pointer;
}

li span {
  flex: 1;
}

li button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #f87171;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}

li button:hover {
  background: rgba(248, 113, 113, 0.15);
}

.footer {
  text-align: center;
  margin-top: 36px;
  color: #64748b;
  font-size: 0.9rem;
}

/* Mobile fine-tuning */
@media (max-width: 520px) {
  .container {
    padding: 24px 18px;
  }
  h1 {
    font-size: 1.8rem;
  }
}
