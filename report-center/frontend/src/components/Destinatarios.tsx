import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Edit2, X, Clock, Tag, ArrowUp, 
  MessageSquare, Mail, MessageCircle, AlertCircle, ToggleLeft, ToggleRight, Loader2
} from 'lucide-react';

interface Recipient {
  id: string;
  name: string;
  description?: string;
  channel: 'whatsapp' | 'whatsapp_group' | 'email' | 'telegram' | 'discord' | 'slack';
  value: string;
  status: 'active' | 'inactive';
  priority: number;
  tags: string[];
  allowedWindow?: { start: string; end: string };
  observations?: string;
  lastDeliveryAt?: string;
  createdAt: string;
  reportIds?: string[];
}

interface Report {
  id: string;
  name: string;
}

interface DestinatariosProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const Destinatarios: React.FC<DestinatariosProps> = ({ addToast }) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'whatsapp_group' | 'email' | 'telegram' | 'discord' | 'slack'>('whatsapp');
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<number>(1);
  const [tagsInput, setTagsInput] = useState('');
  const [enableWindow, setEnableWindow] = useState(false);
  const [windowStart, setWindowStart] = useState('08:00');
  const [windowEnd, setWindowEnd] = useState('20:00');
  const [observations, setObservations] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const fetchRecipients = async () => {
    try {
      const res = await fetch('/api/recipients');
      if (res.ok) {
        const data = await res.json();
        setRecipients(data);
      }
    } catch (e) {
      console.error(e);
      addToast('Error al cargar la lista de destinatarios.', 'error');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchRecipients(), fetchReports()]);
      setLoading(false);
    };
    init();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setChannel('whatsapp');
    setValue('');
    setPriority(1);
    setTagsInput('');
    setEnableWindow(false);
    setWindowStart('08:00');
    setWindowEnd('20:00');
    setObservations('');
    setSelectedReports([]);
    setShowModal(true);
  };

  const openEditModal = (rec: Recipient) => {
    setEditingId(rec.id);
    setName(rec.name);
    setDescription(rec.description || '');
    setChannel(rec.channel);
    setValue(rec.value);
    setPriority(rec.priority || 1);
    setTagsInput(rec.tags ? rec.tags.join(', ') : '');
    setEnableWindow(!!rec.allowedWindow);
    setWindowStart(rec.allowedWindow?.start || '08:00');
    setWindowEnd(rec.allowedWindow?.end || '20:00');
    setObservations(rec.observations || '');
    setSelectedReports(rec.reportIds || []);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) {
      addToast('Por favor, ingresa el nombre y el valor de envío.', 'warning');
      return;
    }

    const payload = {
      name,
      description,
      channel,
      value,
      status: 'active',
      priority: Number(priority),
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0),
      allowedWindow: enableWindow ? { start: windowStart, end: windowEnd } : null,
      observations,
      reportIds: selectedReports
    };

    try {
      const url = editingId ? `/api/recipients/${editingId}` : '/api/recipients';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast(
          editingId ? 'Destinatario actualizado con éxito.' : 'Destinatario creado con éxito.',
          'success'
        );
        setShowModal(false);
        // Refresh both
        await Promise.all([fetchRecipients(), fetchReports()]);
      } else {
        const errorData = await res.json();
        addToast(errorData.error || 'Ocurrió un error al guardar.', 'error');
      }
    } catch (err) {
      addToast('Error de red al guardar el destinatario.', 'error');
    }
  };

  const handleToggleStatus = async (rec: Recipient) => {
    const newStatus = rec.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/recipients/${rec.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        addToast(
          `Destinatario "${rec.name}" ${newStatus === 'active' ? 'activado' : 'desactivado'}.`,
          newStatus === 'active' ? 'success' : 'warning'
        );
        fetchRecipients();
      }
    } catch (e) {
      addToast('Error al cambiar el estado del destinatario.', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al destinatario "${name}"?`)) return;
    try {
      const res = await fetch(`/api/recipients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast(`Destinatario "${name}" eliminado con éxito.`, 'success');
        fetchRecipients();
      }
    } catch (e) {
      addToast('Error al eliminar destinatario.', 'error');
    }
  };

  const getChannelBadge = (ch: Recipient['channel']) => {
    const badges: Record<Recipient['channel'], { label: string, style: string, icon: any }> = {
      whatsapp: { label: 'WhatsApp', style: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: MessageSquare },
      whatsapp_group: { label: 'Grupo WA', style: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', icon: MessageCircle },
      email: { label: 'Email', style: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', icon: Mail },
      telegram: { label: 'Telegram', style: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: MessageSquare },
      discord: { label: 'Discord', style: 'bg-violet-500/10 text-violet-400 border border-violet-500/20', icon: MessageSquare },
      slack: { label: 'Slack', style: 'bg-pink-500/10 text-pink-400 border border-pink-500/20', icon: MessageSquare }
    };
    const b = badges[ch] || { label: ch, style: 'bg-zinc-800 text-zinc-400 border border-zinc-700', icon: MessageSquare };
    const Icon = b.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${b.style}`}>
        <Icon className="w-3 h-3" />
        {b.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-dark-text">Centro de Destinatarios</h2>
          <p className="text-sm text-dark-muted">Administra los destinos, canales de comunicación y variables horarias para el despacho de reportes.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg text-sm font-semibold transition shadow-md shadow-brand-red/10 animate-fade-in"
        >
          <Plus className="w-4 h-4" />
          Añadir Destinatario
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
        </div>
      ) : recipients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-dark-card border border-dark-border rounded-2xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-dark-muted" />
          <h3 className="text-sm font-semibold text-dark-text">No hay destinatarios registrados</h3>
          <p className="text-xs text-dark-muted max-w-xs">
            Crea tu primer destinatario para asociarlo a los reportes del Scheduler y comenzar a enviar alertas.
          </p>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg/60 border-b border-dark-border text-xs font-bold text-dark-muted uppercase tracking-wider">
                  <th className="px-6 py-4">Prioridad / Nombre</th>
                  <th className="px-6 py-4">Canal</th>
                  <th className="px-6 py-4">Dirección / Teléfono</th>
                  <th className="px-6 py-4">Etiquetas</th>
                  <th className="px-6 py-4">Reportes Asig.</th>
                  <th className="px-6 py-4">Ventana Horaria</th>
                  <th className="px-6 py-4">Último Envío</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40 text-sm">
                {recipients.map((rec) => (
                  <tr key={rec.id} className="hover:bg-dark-bg/20 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-dark-text">
                          <ArrowUp className="w-2.5 h-2.5 text-zinc-500 mr-0.5" />
                          {rec.priority}
                        </div>
                        <div>
                          <div className="font-bold text-dark-text">{rec.name}</div>
                          {rec.description && (
                            <div className="text-xs text-dark-muted">{rec.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getChannelBadge(rec.channel)}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-dark-text/95 bg-dark-bg px-2.5 py-1 rounded border border-dark-border/50">
                        {rec.value}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {rec.tags && rec.tags.length > 0 ? (
                          rec.tags.map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700/60 rounded text-[10px] font-medium">
                              <Tag className="w-2 h-2 mr-0.5" />
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-dark-muted italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {rec.reportIds ? rec.reportIds.length : 0} Asig.
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {rec.allowedWindow ? (
                        <span className="text-xs font-medium text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.allowedWindow.start} - {rec.allowedWindow.end}
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                          24 Horas
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-dark-muted font-mono">
                      {rec.lastDeliveryAt ? (
                        new Date(rec.lastDeliveryAt).toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit' })
                      ) : (
                        <span className="italic">Nunca</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(rec)}
                        className="text-dark-muted hover:text-dark-text transition duration-200"
                        title={rec.status === 'active' ? 'Desactivar' : 'Activar'}
                      >
                        {rec.status === 'active' ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                            <ToggleRight className="w-8 h-8 text-emerald-500" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-dark-muted text-xs font-semibold">
                            <ToggleLeft className="w-8 h-8 text-dark-muted" />
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(rec)}
                          className="p-1.5 hover:bg-zinc-800 rounded border border-transparent hover:border-zinc-700 text-dark-muted hover:text-dark-text transition"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id, rec.name)}
                          className="p-1.5 hover:bg-brand-red/10 rounded border border-transparent hover:border-brand-red/20 text-dark-muted hover:text-brand-red transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-dark-card border border-dark-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/30">
              <h3 className="text-base font-bold text-dark-text">
                {editingId ? 'Editar Destinatario' : 'Añadir Destinatario'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 text-dark-muted hover:text-dark-text hover:bg-zinc-850 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Nombre</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Supervisor Izaguirre"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Canal</label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value as any)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red"
                  >
                    <option value="whatsapp">WhatsApp Directo</option>
                    <option value="whatsapp_group">Grupo de WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="telegram">Telegram</option>
                    <option value="discord">Discord</option>
                    <option value="slack">Slack</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Descripción</label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Ej. Recibe reportes PDT todos los días"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">
                    {channel === 'whatsapp' ? 'Número de Teléfono (+51XXXXXXXXX)' : channel === 'whatsapp_group' ? 'ID/JID del Grupo (ej. 12036321287955@g.us)' : 'Valor de Envío / Correo / Webhook'}
                  </label>
                  <input
                    type="text"
                    required
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={channel === 'whatsapp' ? '51987654321' : 'Ingresa la dirección o identificador'}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Prioridad (1 = Mayor)</label>
                  <input
                    type="number"
                    min="1"
                    value={priority}
                    onChange={e => setPriority(Number(e.target.value))}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Etiquetas (Separadas por coma)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="norte, gerencia, bo"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Associated Reports Checklist */}
                <div className="space-y-1.5 col-span-2 border-t border-dark-border/40 pt-3">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">
                    Reportes que recibirá este destinatario
                  </label>
                  {reports.length === 0 ? (
                    <span className="text-xs text-dark-muted">No hay reportes creados.</span>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-dark-bg border border-dark-border rounded-lg max-h-32 overflow-y-auto">
                      {reports.map((rep) => (
                        <label key={rep.id} className="flex items-center gap-2 text-xs text-dark-text cursor-pointer hover:bg-dark-card/50 p-1.5 rounded transition">
                          <input 
                            type="checkbox"
                            checked={selectedReports.includes(rep.id)}
                            onChange={() => {
                              setSelectedReports(prev => 
                                prev.includes(rep.id) ? prev.filter(id => id !== rep.id) : [...prev, rep.id]
                              );
                            }}
                            className="rounded border-dark-border bg-dark-bg text-brand-red focus:ring-0"
                          />
                          <span className="font-semibold">{rep.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Horary Window Checkbox */}
                <div className="col-span-2 border-t border-dark-border/40 pt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableWindow"
                    checked={enableWindow}
                    onChange={e => setEnableWindow(e.target.checked)}
                    className="rounded bg-dark-bg border-dark-border text-brand-red focus:ring-0"
                  />
                  <label htmlFor="enableWindow" className="text-xs font-bold text-dark-text cursor-pointer select-none">
                    Restringir ventana horaria de envíos
                  </label>
                </div>

                {enableWindow && (
                  <div className="col-span-2 grid grid-cols-2 gap-4 bg-dark-bg/40 p-3 rounded-lg border border-dark-border/30">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Hora Inicio</label>
                      <input
                        type="time"
                        value={windowStart}
                        onChange={e => setWindowStart(e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-xs text-dark-text"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Hora Fin</label>
                      <input
                        type="time"
                        value={windowEnd}
                        onChange={e => setWindowEnd(e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1.5 text-xs text-dark-text"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 col-span-2 border-t border-dark-border/40 pt-3">
                  <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Observaciones</label>
                  <textarea
                    rows={2}
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder="Notas o comentarios sobre el destinatario"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-dark-border text-dark-text hover:bg-zinc-800 rounded-lg text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg text-sm font-semibold transition shadow-md shadow-brand-red/10"
                >
                  {editingId ? 'Guardar Cambios' : 'Añadir Destinatario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
