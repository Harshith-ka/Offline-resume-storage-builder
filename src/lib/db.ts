import { openDB, type IDBPDatabase } from "idb";
import type { ResumeDocument } from "@/types/resume";

const DB_NAME = "resume-forge-db";
const DB_VERSION = 1;
const STORE_RESUMES = "resumes";
const STORE_VERSIONS = "versions";

export interface StoredResume {
  id: string;
  name: string;
  document: ResumeDocument;
  updatedAt: string;
}

export interface VersionEntry {
  id: string;
  resumeId: string;
  version: number;
  document: ResumeDocument;
  createdAt: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_RESUMES)) {
          const resumeStore = db.createObjectStore(STORE_RESUMES, { keyPath: "id" });
          resumeStore.createIndex("updatedAt", "updatedAt");
        }
        if (!db.objectStoreNames.contains(STORE_VERSIONS)) {
          const versionStore = db.createObjectStore(STORE_VERSIONS, { keyPath: "id" });
          versionStore.createIndex("resumeId", "resumeId");
          versionStore.createIndex("resumeId_version", ["resumeId", "version"]);
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllResumes(): Promise<StoredResume[]> {
  const db = await getDB();
  const list = await db.getAll(STORE_RESUMES);
  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getResume(id: string): Promise<StoredResume | undefined> {
  const db = await getDB();
  return db.get(STORE_RESUMES, id);
}

export async function saveResume(document: ResumeDocument): Promise<void> {
  const db = await getDB();
  const now = new Date().toISOString();
  const docWithMeta: ResumeDocument = {
    ...document,
    updatedAt: now,
    version: (document.version || 0) + 1,
  };
  const stored: StoredResume = {
    id: document.id,
    name: document.name,
    document: docWithMeta,
    updatedAt: now,
  };
  await db.put(STORE_RESUMES, stored);
  await saveVersion(document.id, docWithMeta.version, docWithMeta);
}

async function saveVersion(resumeId: string, version: number, document: ResumeDocument): Promise<void> {
  const db = await getDB();
  const entry: VersionEntry = {
    id: `${resumeId}_v${version}`,
    resumeId,
    version,
    document: { ...document },
    createdAt: new Date().toISOString(),
  };
  await db.put(STORE_VERSIONS, entry);
}

export async function getVersions(resumeId: string): Promise<VersionEntry[]> {
  const db = await getDB();
  const index = db.transaction(STORE_VERSIONS).store.index("resumeId");
  const entries = await index.getAll(resumeId);
  return entries.sort((a, b) => b.version - a.version);
}

export async function deleteResume(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_RESUMES, id);
  const versionStore = db.transaction(STORE_VERSIONS).store;
  const index = versionStore.index("resumeId");
  const keys = await index.getAllKeys(id);
  for (const key of keys) {
    await versionStore.delete(key);
  }
}

export async function duplicateResume(id: string, newName?: string): Promise<ResumeDocument> {
  const existing = await getResume(id);
  if (!existing) throw new Error("Resume not found");
  const doc = existing.document;
  const newId = `resume_${Date.now()}`;
  const now = new Date().toISOString();
  const newDoc: ResumeDocument = {
    ...doc,
    id: newId,
    name: newName ?? `${doc.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  await saveResume(newDoc);
  return newDoc;
}
