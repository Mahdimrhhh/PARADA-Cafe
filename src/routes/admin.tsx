import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { CategoryIcon, ICON_KEYS } from "@/components/category-icons";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { fileToImageUrl } from "@/lib/compress-image";
import { formatToman } from "@/lib/format";
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  getMenu,
  updateCategory,
  updateItem,
  updatePin,
  updateSettings,
  verifyPin,
} from "@/lib/menu";
import type { MenuCategory, MenuItem, MenuPayload } from "@/lib/types";
import { cn } from "@/lib/utils";

const GATE_KEY = "parada-admin";

export const Route = createFileRoute("/admin")({
  loader: () => getMenu(),
  component: AdminPage,
});

function AdminPage() {
  const initial = Route.useLoaderData();
  const [unlocked, setUnlocked] = useState(false);
  const [menu, setMenu] = useState<MenuPayload>(initial);

  useEffect(() => {
    if (sessionStorage.getItem(GATE_KEY) === "1") setUnlocked(true);
  }, []);

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <AdminShell
      menu={menu}
      onMenu={setMenu}
      onLock={() => {
        sessionStorage.removeItem(GATE_KEY);
        setUnlocked(false);
      }}
    />
  );
}

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await verifyPin({ data: { pin } });
      if (!result.ok) {
        toast.error("کد ورود نادرست است.");
        return;
      }
      sessionStorage.setItem(GATE_KEY, "1");
      onUnlock();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="plaster-page flex min-h-dvh items-center justify-center px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-[28px] bg-cream/70 p-6 shadow-[var(--shadow-border)]"
      >
        <p className="font-display text-center text-sm tracking-[0.4em] text-ink">
          PARADA
        </p>
        <h1 className="mt-3 text-center text-xl font-medium">ورود مدیریت</h1>
        <p className="mt-2 text-center text-sm text-mist">
          برای ویرایش قیمت، عکس و جزئیات آیتم‌ها.
        </p>
        <div className="mt-6 space-y-2">
          <Label htmlFor="pin">کد ورود</Label>
          <Input
            id="pin"
            type="password"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            required
          />
        </div>
        <Button type="submit" className="mt-5 w-full" disabled={busy}>
          {busy ? "در حال بررسی..." : "ورود"}
        </Button>
        <Link
          to="/"
          className="mt-4 block text-center text-sm text-mist hover:text-ink"
        >
          بازگشت به منو
        </Link>
      </form>
    </div>
  );
}

function AdminShell({
  menu,
  onMenu,
  onLock,
}: {
  menu: MenuPayload;
  onMenu: (menu: MenuPayload) => void;
  onLock: () => void;
}) {
  const [tab, setTab] = useState<"items" | "categories" | "settings">("items");
  const [categoryId, setCategoryId] = useState(menu.categories[0]?.id ?? 0);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);

  const category =
    menu.categories.find((row) => row.id === categoryId) ?? menu.categories[0];

  return (
    <div className="plaster-page min-h-dvh">
      <header className="sticky-lintel sticky top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-display text-xs tracking-[0.35em] text-ink">PARADA</p>
            <h1 className="text-base font-medium">پنل منو</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLock}>
              قفل
            </Button>
            <Link to="/" className="text-sm text-mist hover:text-ink">
              مشاهده منو
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3">
          {(
            [
              ["items", "آیتم‌ها"],
              ["categories", "دسته‌ها"],
              ["settings", "تنظیمات"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "h-10 rounded-full px-4 text-sm",
                tab === id ? "bg-ink text-cream" : "bg-cream/70 text-ink-soft",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {tab === "items" && category ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section>
              <div className="flex flex-wrap items-center gap-2">
                {menu.categories.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setCategoryId(row.id)}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-full px-3 text-sm",
                      row.id === category.id
                        ? "bg-ink text-cream"
                        : "bg-cream/70 text-ink-soft",
                    )}
                  >
                    <CategoryIcon name={row.iconKey} className="size-5" />
                    {row.nameFa}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-mist">{category.items.length} آیتم</p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditing(null);
                    setCreating(true);
                  }}
                >
                  آیتم جدید
                </Button>
              </div>
              <ul className="mt-3 divide-y divide-border rounded-[20px] bg-cream/50 shadow-[var(--shadow-border)]">
                {category.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-3 py-3">
                    <div className="size-12 overflow-hidden rounded-[12px] bg-plaster-deep">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center text-stone-deep">
                          <CategoryIcon name={category.iconKey} className="size-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.nameFa}</p>
                      <p className="text-xs text-mist" dir="ltr">
                        {formatToman(item.priceToman)} · {item.nameEn}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCreating(false);
                        setEditing(item);
                      }}
                    >
                      ویرایش
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
            {editing || creating ? (
              <ItemEditor
                key={editing?.id ?? "new"}
                item={editing}
                categoryId={category.id}
                categories={menu.categories}
                onClose={() => {
                  setEditing(null);
                  setCreating(false);
                }}
                onSaved={(next) => {
                  onMenu(next);
                  setEditing(null);
                  setCreating(false);
                }}
              />
            ) : null}
          </div>
        ) : null}

        {tab === "categories" ? (
          <CategoriesEditor menu={menu} onMenu={onMenu} />
        ) : null}

        {tab === "settings" ? (
          <SettingsEditor menu={menu} onMenu={onMenu} />
        ) : null}
      </div>
    </div>
  );
}

function ItemEditor({
  item,
  categoryId,
  categories,
  onClose,
  onSaved,
}: {
  item: MenuItem | null;
  categoryId: number;
  categories: MenuCategory[];
  onClose: () => void;
  onSaved: (menu: MenuPayload) => void;
}) {
  const [form, setForm] = useState({
    categoryId: item?.categoryId ?? categoryId,
    nameFa: item?.nameFa ?? "",
    nameEn: item?.nameEn ?? "",
    descriptionFa: item?.descriptionFa ?? "",
    priceToman: item?.priceToman ?? 0,
    imageUrl: item?.imageUrl ?? null,
    isAvailable: item?.isAvailable ?? true,
    isFeatured: item?.isFeatured ?? false,
    isNew: item?.isNew ?? false,
    sortOrder: item?.sortOrder ?? 0,
  });
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form };
      const next = item
        ? await updateItem({ data: { id: item.id, ...payload } })
        : await createItem({ data: payload });
      toast.success("ذخیره شد.");
      onSaved(next);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!item) return;
    if (!window.confirm("این آیتم حذف شود؟")) return;
    setBusy(true);
    try {
      const next = await deleteItem({ data: { id: item.id } });
      toast.success("حذف شد.");
      onSaved(next);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حذف نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const url = await fileToImageUrl(file);
      setForm((current) => ({ ...current, imageUrl: url }));
    } catch {
      toast.error("آپلود تصویر انجام نشد.");
    }
  }

  return (
    <form
      onSubmit={save}
      className="h-fit rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{item ? "ویرایش آیتم" : "آیتم جدید"}</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          بستن
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        <Field label="نام فارسی">
          <Input
            value={form.nameFa}
            onChange={(event) => setForm({ ...form, nameFa: event.target.value })}
            required
          />
        </Field>
        <Field label="نام انگلیسی">
          <Input
            dir="ltr"
            value={form.nameEn}
            onChange={(event) => setForm({ ...form, nameEn: event.target.value })}
          />
        </Field>
        <Field label="توضیح">
          <Textarea
            value={form.descriptionFa}
            onChange={(event) =>
              setForm({ ...form, descriptionFa: event.target.value })
            }
          />
        </Field>
        <Field label="قیمت (تومان)">
          <Input
            dir="ltr"
            type="number"
            min={0}
            value={form.priceToman}
            onChange={(event) =>
              setForm({ ...form, priceToman: Number(event.target.value) })
            }
            required
          />
        </Field>
        <Field label="دسته">
          <select
            className="h-11 w-full rounded-[12px] bg-cream px-3 text-ink shadow-[var(--shadow-border)]"
            value={form.categoryId}
            onChange={(event) =>
              setForm({ ...form, categoryId: Number(event.target.value) })
            }
          >
            {categories.map((row) => (
              <option key={row.id} value={row.id}>
                {row.nameFa}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ترتیب">
          <Input
            dir="ltr"
            type="number"
            value={form.sortOrder}
            onChange={(event) =>
              setForm({ ...form, sortOrder: Number(event.target.value) })
            }
          />
        </Field>
        <Field label="عکس">
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          {form.imageUrl ? (
            <div className="mt-2 overflow-hidden rounded-[16px]">
              <img src={form.imageUrl} alt="" className="h-36 w-full object-cover" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setForm({ ...form, imageUrl: null })}
              >
                حذف عکس
              </Button>
            </div>
          ) : (
            <p className="mt-1 text-xs text-mist">بدون عکس هم در منو شکل طاق می‌ماند.</p>
          )}
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(event) =>
              setForm({ ...form, isAvailable: event.target.checked })
            }
          />
          موجود است
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) =>
              setForm({ ...form, isFeatured: event.target.checked })
            }
          />
          انتخاب خانه (نمایش بزرگ)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(event) => setForm({ ...form, isNew: event.target.checked })}
          />
          جدید
        </label>
      </div>
      <div className="mt-5 flex gap-2">
        <Button type="submit" disabled={busy} className="flex-1">
          ذخیره
        </Button>
        {item ? (
          <Button type="button" variant="danger" disabled={busy} onClick={remove}>
            حذف
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function CategoriesEditor({
  menu,
  onMenu,
}: {
  menu: MenuPayload;
  onMenu: (menu: MenuPayload) => void;
}) {
  const [nameFa, setNameFa] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [iconKey, setIconKey] = useState("cup");

  async function add(event: FormEvent) {
    event.preventDefault();
    try {
      const next = await createCategory({
        data: {
          nameFa,
          nameEn,
          slug: slug || nameEn.toLowerCase().replace(/\s+/g, "-"),
          iconKey,
          sortOrder: menu.categories.length + 1,
        },
      });
      onMenu(next);
      setNameFa("");
      setNameEn("");
      setSlug("");
      toast.success("دسته اضافه شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "اضافه نشد.");
    }
  }

  return (
    <div className="space-y-4">
      {menu.categories.map((category) => (
        <CategoryRow key={category.id} category={category} onMenu={onMenu} />
      ))}
      <form
        onSubmit={add}
        className="rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]"
      >
        <h2 className="font-medium">دسته جدید</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="نام فارسی">
            <Input value={nameFa} onChange={(event) => setNameFa(event.target.value)} required />
          </Field>
          <Field label="نام انگلیسی">
            <Input dir="ltr" value={nameEn} onChange={(event) => setNameEn(event.target.value)} />
          </Field>
          <Field label="slug">
            <Input
              dir="ltr"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="espresso"
            />
          </Field>
          <Field label="آیکون">
            <select
              className="h-11 w-full rounded-[12px] bg-cream px-3 shadow-[var(--shadow-border)]"
              value={iconKey}
              onChange={(event) => setIconKey(event.target.value)}
            >
              {ICON_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Button type="submit" className="mt-4">
          افزودن دسته
        </Button>
      </form>
    </div>
  );
}

function CategoryRow({
  category,
  onMenu,
}: {
  category: MenuCategory;
  onMenu: (menu: MenuPayload) => void;
}) {
  const [nameFa, setNameFa] = useState(category.nameFa);
  const [nameEn, setNameEn] = useState(category.nameEn);
  const [slug, setSlug] = useState(category.slug);
  const [iconKey, setIconKey] = useState(category.iconKey);
  const [sortOrder, setSortOrder] = useState(category.sortOrder);

  async function save() {
    try {
      const next = await updateCategory({
        data: {
          id: category.id,
          nameFa,
          nameEn,
          slug,
          iconKey,
          sortOrder,
        },
      });
      onMenu(next);
      toast.success("دسته ذخیره شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره نشد.");
    }
  }

  async function remove() {
    if (!window.confirm("این دسته حذف شود؟")) return;
    const result = await deleteCategory({ data: { id: category.id } });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onMenu(result.menu);
    toast.success("حذف شد.");
  }

  return (
    <div className="rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="نام فارسی">
          <Input value={nameFa} onChange={(event) => setNameFa(event.target.value)} />
        </Field>
        <Field label="نام انگلیسی">
          <Input dir="ltr" value={nameEn} onChange={(event) => setNameEn(event.target.value)} />
        </Field>
        <Field label="slug">
          <Input dir="ltr" value={slug} onChange={(event) => setSlug(event.target.value)} />
        </Field>
        <Field label="ترتیب">
          <Input
            dir="ltr"
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </Field>
        <Field label="آیکون">
          <select
            className="h-11 w-full rounded-[12px] bg-cream px-3 shadow-[var(--shadow-border)]"
            value={iconKey}
            onChange={(event) => setIconKey(event.target.value)}
          >
            {ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" size="sm" onClick={save}>
          ذخیره
        </Button>
        <Button type="button" size="sm" variant="danger" onClick={remove}>
          حذف
        </Button>
      </div>
    </div>
  );
}

function SettingsEditor({
  menu,
  onMenu,
}: {
  menu: MenuPayload;
  onMenu: (menu: MenuPayload) => void;
}) {
  const [cafeName, setCafeName] = useState(menu.settings.cafeName);
  const [taglineFa, setTaglineFa] = useState(menu.settings.taglineFa);
  const [taglineEn, setTaglineEn] = useState(menu.settings.taglineEn);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    try {
      const payload = await updateSettings({
        data: { cafeName, taglineFa, taglineEn },
      });
      onMenu(payload);
      toast.success("تنظیمات ذخیره شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره نشد.");
    }
  }

  async function savePin(event: FormEvent) {
    event.preventDefault();
    const result = await updatePin({ data: { current, next } });
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setCurrent("");
    setNext("");
    toast.success("کد ورود عوض شد.");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form
        onSubmit={saveSettings}
        className="rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]"
      >
        <h2 className="font-medium">هویت کافه</h2>
        <div className="mt-3 space-y-3">
          <Field label="نام">
            <Input value={cafeName} onChange={(event) => setCafeName(event.target.value)} />
          </Field>
          <Field label="شعار فارسی">
            <Input value={taglineFa} onChange={(event) => setTaglineFa(event.target.value)} />
          </Field>
          <Field label="شعار انگلیسی">
            <Input
              dir="ltr"
              value={taglineEn}
              onChange={(event) => setTaglineEn(event.target.value)}
            />
          </Field>
        </div>
        <Button type="submit" className="mt-4">
          ذخیره
        </Button>
      </form>
      <form
        onSubmit={savePin}
        className="rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]"
      >
        <h2 className="font-medium">کد ورود مدیریت</h2>
        <div className="mt-3 space-y-3">
          <Field label="کد فعلی">
            <Input
              type="password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              required
            />
          </Field>
          <Field label="کد جدید">
            <Input
              type="password"
              value={next}
              onChange={(event) => setNext(event.target.value)}
              required
              minLength={4}
            />
          </Field>
        </div>
        <Button type="submit" className="mt-4">
          تغییر کد
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
