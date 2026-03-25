"use client"

import { useEffect, useState, useCallback } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Task {
  id: string
  title: string
  description?: string | null
  completed: boolean
}

type ToastType = "success" | "error" | "info"
interface Toast { id: number; message: string; type: ToastType }
interface ConfirmModal { visible: boolean; taskId: string | null; taskTitle: string }
interface EditModal { visible: boolean; task: Task | null }

let toastCounter = 0

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState("")
  const [descInput, setDescInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [confirm, setConfirm] = useState<ConfirmModal>({ visible: false, taskId: null, taskTitle: "" })
  const [edit, setEdit] = useState<EditModal>({ visible: false, task: null })
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, []) // eslint-disable-line

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  async function fetchTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`)
      if (!res.ok) throw new Error()
      setTasks(await res.json())
    } catch {
      addToast("Nao foi possivel carregar as tarefas.", "error")
    }
  }

  useEffect(() => { fetchTasks() }, []) // eslint-disable-line

  async function handleAdd() {
    const title = input.trim()
    if (!title) { addToast("Digite um titulo para a tarefa.", "error"); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: descInput.trim() || null }),
      })
      if (!res.ok) throw new Error()
      setInput(""); setDescInput("")
      await fetchTasks()
      addToast("Tarefa adicionada com sucesso!", "success")
    } catch {
      addToast("Erro ao adicionar a tarefa.", "error")
    } finally {
      setLoading(false)
    }
  }

  async function handleComplete(task: Task) {
    if (task.completed) { addToast("Esta tarefa ja foi concluida.", "info"); return }
    const id = task.id
    console.log(id)
    try {
      const res = await fetch(`${API_URL}/tasks/${id}/complete`, { method: "PATCH" })
      if (!res.ok && res.status !== 400) throw new Error()
      await fetchTasks()
      addToast("Tarefa concluida!", "success")
    } catch {
      addToast("Erro ao concluir a tarefa.", "error")
    }
  }

  function askDelete(task: Task) { setConfirm({ visible: true, taskId: task.id, taskTitle: task.title }) }

  async function confirmDelete() {
    if (!confirm.taskId) return
    const id = confirm.taskId
    setConfirm({ visible: false, taskId: null, taskTitle: "" })
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await fetchTasks()
      addToast("Tarefa removida.", "success")
    } catch {
      addToast("Erro ao remover a tarefa.", "error")
    }
  }

  function cancelDelete() { setConfirm({ visible: false, taskId: null, taskTitle: "" }) }

  function openEdit(task: Task) {
    setEdit({ visible: true, task })
    setEditTitle(task.title)
    setEditDesc(task.description ?? "")
  }

  function closeEdit() { setEdit({ visible: false, task: null }); setEditTitle(""); setEditDesc("") }

  async function handleUpdate() {
    if (!edit.task) return
    const title = editTitle.trim()
    if (!title) { addToast("O titulo nao pode ser vazio.", "error"); return }
    setEditLoading(true)
    try {
      const res = await fetch(`${API_URL}/tasks/${edit.task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: editDesc.trim() || null }),
      })
      if (!res.ok) throw new Error()
      closeEdit(); await fetchTasks()
      addToast("Tarefa atualizada!", "success")
    } catch {
      addToast("Erro ao atualizar a tarefa.", "error")
    } finally {
      setEditLoading(false)
    }
  }

  const done = tasks.filter((t) => t.completed).length
  const progress = tasks.length > 0 ? (done / tasks.length) * 100 : 0

  return (
    <>
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span className="toast-icon">{t.type === "success" && "✓"}{t.type === "error" && "✕"}{t.type === "info" && "ℹ"}</span>
            <span className="toast-msg">{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
          </div>
        ))}
      </div>

      {confirm.visible && (
        <div className="overlay" onClick={cancelDelete}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h2 className="modal-title">Remover tarefa?</h2>
            <p className="modal-body">
              Tem certeza que deseja remover <strong>&quot;{confirm.taskTitle}&quot;</strong>?
              <br />Essa ação nao pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelDelete}>Cancelar</button>
              <button className="btn-confirm" onClick={confirmDelete}>Sim, remover</button>
            </div>
          </div>
        </div>
      )}

      {edit.visible && (
        <div className="overlay" onClick={closeEdit}>
          <div className="modal modal--edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">✏️</div>
            <h2 className="modal-title">Editar tarefa</h2>
            <div className="edit-field">
              <label className="edit-label">Titulo *</label>
              <input className="edit-input" type="text" value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                maxLength={120} placeholder="Titulo da tarefa" autoFocus />
            </div>
            <div className="edit-field">
              <label className="edit-label">Descricao</label>
              <textarea className="edit-textarea" value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Descricao opcional..." rows={3} maxLength={500} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeEdit}>Cancelar</button>
              <button className="btn-save" onClick={handleUpdate} disabled={editLoading}>
                {editLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="app-wrapper">
        <div className="app-header">
          <h1 className="app-title">Minhas Tarefas</h1>
          <p className="app-subtitle">Organize seu dia</p>
        </div>

        <div className="add-card">
          <div className="add-card__fields">
            <input type="text" placeholder="O que voce vai fazer hoje?"
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="add-input add-input--title" maxLength={120} />
            <div className="add-card__divider" />
            <input type="text" placeholder="Descricao (opcional)"
              value={descInput} onChange={(e) => setDescInput(e.target.value)}
              className="add-input add-input--desc" maxLength={500} />
          </div>
          <button onClick={handleAdd} disabled={loading} className="add-btn">
            {loading ? "..." : "ADICIONAR"}
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="task-card">
            <div className="task-card__header">
              <span className="task-card__count">{done}/{tasks.length} concluidas</span>
              <div className="task-card__bar">
                <div className="task-card__bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item${task.completed ? " task-item--done" : ""}`}>
                  <button onClick={() => handleComplete(task)}
                    className={`checkbox${task.completed ? " checkbox--done" : ""}`}
                    aria-label="Marcar como concluida">
                    {task.completed && (
                      <svg viewBox="0 0 10 8" fill="none" className="check-icon">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="task-content">
                    <span className={`task-title${task.completed ? " task-title--done" : ""}`}>{task.title}</span>
                    {task.description && <span className="task-desc">{task.description}</span>}
                  </div>
                  <div className="task-actions">
                    {!task.completed && (
                      <button onClick={() => openEdit(task)} className="action-btn action-btn--edit" title="Editar">
                        <svg viewBox="0 0 16 16" fill="none" className="action-icon">
                          <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                    <button onClick={() => askDelete(task)} className="action-btn action-btn--delete" title="Remover">
                      <svg viewBox="0 0 16 18" fill="none" className="action-icon">
                        <path d="M1 4h14M5 4V2h6v2M6 8v6M10 8v6M2 4l1 12h10L14 4H2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state__msg">Nenhuma tarefa ainda.</p>
            <p className="empty-state__sub">Adicione uma acima para comecar!</p>
          </div>
        )}
      </div>
    </>
  )
}