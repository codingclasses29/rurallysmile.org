"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminService, type NoticeAdmin } from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

export default function AdminNoticesPage() {
  const [items, setItems] = useState<NoticeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [titleHindi, setTitleHindi] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiLanguage, setAiLanguage] = useState<
    "bilingual" | "hindi" | "english"
  >("bilingual");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [aiModel, setAiModel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.notices();
      const raw = res.data;
      const list = Array.isArray(raw)
        ? raw
        : raw && typeof raw === "object" && "notices" in raw
          ? (raw as { notices: NoticeAdmin[] }).notices
          : [];
      setItems(list);
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load notices"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    void adminService
      .aiStatus()
      .then((res) => {
        setAiConfigured(Boolean(res.data?.configured));
        setAiModel(res.data?.model || "");
      })
      .catch(() => setAiConfigured(false));
  }, [load]);

  const generateWithGemini = async () => {
    if (aiTopic.trim().length < 5) {
      notify.error("Notice topic कम से कम 5 characters का लिखें");
      return;
    }
    setAiGenerating(true);
    try {
      const res = await adminService.generateNoticeDraft({
        topic: aiTopic.trim(),
        language: aiLanguage,
        tone: "official",
      });
      const draft = res.data?.draft;
      if (!draft) throw new Error("Empty AI response");
      setTitle(draft.title);
      setTitleHindi(draft.titleHindi);
      setDescription(draft.description);
      setAiModel(draft.model);
      notify.success("Gemini draft ready — review before publishing");
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Gemini draft failed"
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.createNotice({
        title,
        titleHindi,
        description,
        published: true,
        type: "General",
      });
      notify.success("Notice created");
      setTitle("");
      setTitleHindi("");
      setDescription("");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Create failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await adminService.deleteNotice(id);
      notify.success("Deleted");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Delete failed"
      );
    }
  };

  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Notices</h1>
      <p className="text-muted mb-4">Create & manage portal notices</p>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white fw-bold d-flex align-items-center justify-content-between">
              <span>New Notice</span>
              <span
                className={`badge ${
                  aiConfigured ? "text-bg-success" : "text-bg-secondary"
                }`}
              >
                Gemini {aiConfigured ? "Ready" : "Setup needed"}
              </span>
            </div>
            <div className="card-body">
              <section
                className="rounded-4 border border-primary-subtle bg-primary-subtle bg-opacity-25 p-3 mb-4"
                aria-labelledby="gemini-notice-heading"
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="foundation-icon" style={{ width: 38, height: 38 }}>
                    <i className="bi bi-stars" aria-hidden />
                  </span>
                  <div>
                    <h2 id="gemini-notice-heading" className="h6 fw-bold mb-0">
                      Gemini Notice Writer
                    </h2>
                    <div className="text-muted" style={{ fontSize: 11 }}>
                      {aiModel || "gemini-2.5-flash"} · Admin only
                    </div>
                  </div>
                </div>

                <label htmlFor="ai-notice-topic" className="form-label small">
                  Notice का विषय / instructions
                </label>
                <textarea
                  id="ai-notice-topic"
                  className="form-control form-control-sm mb-2"
                  rows={3}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="उदाहरण: Admit card 2 September को जारी होगा..."
                  maxLength={600}
                />
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    aria-label="AI output language"
                    value={aiLanguage}
                    onChange={(e) =>
                      setAiLanguage(
                        e.target.value as "bilingual" | "hindi" | "english"
                      )
                    }
                  >
                    <option value="bilingual">Hindi + English</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm text-nowrap"
                    onClick={() => void generateWithGemini()}
                    disabled={aiGenerating || aiConfigured === false}
                  >
                    <i className="bi bi-stars me-1" aria-hidden />
                    {aiGenerating ? "Writing…" : "Generate"}
                  </button>
                </div>
                {aiConfigured === false && (
                  <p className="small text-danger mt-2 mb-0" role="alert">
                    नई key को <code>server/.env</code> में{" "}
                    <code>GEMINI_API_KEY</code> के रूप में जोड़कर server restart करें।
                  </p>
                )}
              </section>

              <form onSubmit={onCreate}>
                <div className="mb-3">
                  <label htmlFor="notice-title" className="form-label">
                    Title
                  </label>
                  <input
                    id="notice-title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notice-title-hi" className="form-label">
                    Hindi Title
                  </label>
                  <input
                    id="notice-title-hi"
                    className="form-control"
                    value={titleHindi}
                    onChange={(e) => setTitleHindi(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notice-description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="notice-description"
                    className="form-control"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                  {saving ? "Saving…" : "Publish Notice"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold d-flex justify-content-between">
              <span>All Notices</span>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => void load()}>
                Refresh
              </button>
            </div>
            <ul className="list-group list-group-flush">
              {loading && (
                <li className="list-group-item text-center py-4">
                  <div className="spinner-border spinner-border-sm" />
                </li>
              )}
              {!loading && items.length === 0 && (
                <li className="list-group-item text-muted">No notices</li>
              )}
              {items.map((n) => (
                <li
                  key={n._id}
                  className="list-group-item d-flex justify-content-between align-items-start gap-3"
                >
                  <div>
                    <div className="fw-semibold">{n.title}</div>
                    <div className="small text-muted">{n.description}</div>
                    <span
                      className={`badge mt-1 text-bg-${n.published ? "success" : "secondary"}`}
                    >
                      {n.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => void remove(n._id)}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
