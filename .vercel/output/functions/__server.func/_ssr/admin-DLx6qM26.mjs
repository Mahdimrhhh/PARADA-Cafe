import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as createItem, c as updateCategory, d as updateSettings, f as verifyPin, i as createCategory, l as updateItem, n as Route, o as deleteCategory, s as deleteItem, u as updatePin } from "./router-Coh3AXib.mjs";
import { a as formatToman, i as cn, n as CategoryIcon, r as ICON_KEYS, t as Button } from "./format-DqAqKtxT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DLx6qM26.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[12px] bg-cream px-3 text-base text-ink shadow-[var(--shadow-border)] placeholder:text-mist", "transition-[box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-amber/70", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-[14px] bg-cream px-3 py-2.5 text-base text-ink shadow-[var(--shadow-border)] placeholder:text-mist", "transition-[box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-amber/70", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-sm font-medium text-ink-soft", className),
		...props
	});
}
async function fileToImageUrl(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 720 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("امکان فشرده‌سازی تصویر نبود.");
	}
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", .72);
}
var GATE_KEY = "parada-admin";
function AdminPage() {
	const initial = Route.useLoaderData();
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(initial);
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem(GATE_KEY) === "1") setUnlocked(true);
	}, []);
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinGate, { onUnlock: () => setUnlocked(true) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		menu,
		onMenu: setMenu,
		onLock: () => {
			sessionStorage.removeItem(GATE_KEY);
			setUnlocked(false);
		}
	});
}
function PinGate({ onUnlock }) {
	const [pin, setPin] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			if (!(await verifyPin({ data: { pin } })).ok) {
				toast.error("کد ورود نادرست است.");
				return;
			}
			sessionStorage.setItem(GATE_KEY, "1");
			onUnlock();
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "plaster-page flex min-h-dvh items-center justify-center px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "w-full max-w-sm rounded-[28px] bg-cream/70 p-6 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-center text-sm tracking-[0.4em] text-ink",
					children: "PARADA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-center text-xl font-medium",
					children: "ورود مدیریت"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-sm text-mist",
					children: "برای ویرایش قیمت، عکس و جزئیات آیتم‌ها."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pin",
						children: "کد ورود"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pin",
						type: "password",
						autoComplete: "current-password",
						value: pin,
						onChange: (event) => setPin(event.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-5 w-full",
					disabled: busy,
					children: busy ? "در حال بررسی..." : "ورود"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 block text-center text-sm text-mist hover:text-ink",
					children: "بازگشت به منو"
				})
			]
		})
	});
}
function AdminShell({ menu, onMenu, onLock }) {
	const [tab, setTab] = (0, import_react.useState)("items");
	const [categoryId, setCategoryId] = (0, import_react.useState)(menu.categories[0]?.id ?? 0);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const category = menu.categories.find((row) => row.id === categoryId) ?? menu.categories[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "plaster-page min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky-lintel sticky top-0 z-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.35em] text-ink",
					children: "PARADA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-base font-medium",
					children: "پنل منو"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onLock,
						children: "قفل"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm text-mist hover:text-ink",
						children: "مشاهده منو"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3",
				children: [
					["items", "آیتم‌ها"],
					["categories", "دسته‌ها"],
					["settings", "تنظیمات"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("h-10 rounded-full px-4 text-sm", tab === id ? "bg-ink text-cream" : "bg-cream/70 text-ink-soft"),
					children: label
				}, id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-6",
			children: [
				tab === "items" && category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: menu.categories.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setCategoryId(row.id),
								className: cn("flex h-10 items-center gap-2 rounded-full px-3 text-sm", row.id === category.id ? "bg-ink text-cream" : "bg-cream/70 text-ink-soft"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, {
									name: row.iconKey,
									className: "size-5"
								}), row.nameFa]
							}, row.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-mist",
								children: [category.items.length, " آیتم"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => {
									setEditing(null);
									setCreating(true);
								},
								children: "آیتم جدید"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border rounded-[20px] bg-cream/50 shadow-[var(--shadow-border)]",
							children: category.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-12 overflow-hidden rounded-[12px] bg-plaster-deep",
										children: item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: item.imageUrl,
											alt: "",
											className: "size-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-full items-center justify-center text-stone-deep",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, {
												name: category.iconKey,
												className: "size-6"
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-medium",
											children: item.nameFa
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-mist",
											dir: "ltr",
											children: [
												formatToman(item.priceToman),
												" · ",
												item.nameEn
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => {
											setCreating(false);
											setEditing(item);
										},
										children: "ویرایش"
									})
								]
							}, item.id))
						})
					] }), editing || creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemEditor, {
						item: editing,
						categoryId: category.id,
						categories: menu.categories,
						onClose: () => {
							setEditing(null);
							setCreating(false);
						},
						onSaved: (next) => {
							onMenu(next);
							setEditing(null);
							setCreating(false);
						}
					}, editing?.id ?? "new") : null]
				}) : null,
				tab === "categories" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesEditor, {
					menu,
					onMenu
				}) : null,
				tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsEditor, {
					menu,
					onMenu
				}) : null
			]
		})]
	});
}
function ItemEditor({ item, categoryId, categories, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)({
		categoryId: item?.categoryId ?? categoryId,
		nameFa: item?.nameFa ?? "",
		nameEn: item?.nameEn ?? "",
		descriptionFa: item?.descriptionFa ?? "",
		priceToman: item?.priceToman ?? 0,
		imageUrl: item?.imageUrl ?? null,
		isAvailable: item?.isAvailable ?? true,
		isFeatured: item?.isFeatured ?? false,
		isNew: item?.isNew ?? false,
		sortOrder: item?.sortOrder ?? 0
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save(event) {
		event.preventDefault();
		setBusy(true);
		try {
			const payload = { ...form };
			const next = item ? await updateItem({ data: {
				id: item.id,
				...payload
			} }) : await createItem({ data: payload });
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
	async function onFile(file) {
		if (!file) return;
		try {
			const url = await fileToImageUrl(file);
			setForm((current) => ({
				...current,
				imageUrl: url
			}));
		} catch {
			toast.error("آپلود تصویر انجام نشد.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: save,
		className: "h-fit rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: item ? "ویرایش آیتم" : "آیتم جدید"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: onClose,
					children: "بستن"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "نام فارسی",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.nameFa,
							onChange: (event) => setForm({
								...form,
								nameFa: event.target.value
							}),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "نام انگلیسی",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							dir: "ltr",
							value: form.nameEn,
							onChange: (event) => setForm({
								...form,
								nameEn: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "توضیح",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.descriptionFa,
							onChange: (event) => setForm({
								...form,
								descriptionFa: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "قیمت (تومان)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							dir: "ltr",
							type: "number",
							min: 0,
							value: form.priceToman,
							onChange: (event) => setForm({
								...form,
								priceToman: Number(event.target.value)
							}),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "دسته",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-11 w-full rounded-[12px] bg-cream px-3 text-ink shadow-[var(--shadow-border)]",
							value: form.categoryId,
							onChange: (event) => setForm({
								...form,
								categoryId: Number(event.target.value)
							}),
							children: categories.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: row.id,
								children: row.nameFa
							}, row.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "ترتیب",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							dir: "ltr",
							type: "number",
							value: form.sortOrder,
							onChange: (event) => setForm({
								...form,
								sortOrder: Number(event.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "عکس",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							accept: "image/*",
							onChange: (event) => onFile(event.target.files?.[0])
						}), form.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 overflow-hidden rounded-[16px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: form.imageUrl,
								alt: "",
								className: "h-36 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "mt-2",
								onClick: () => setForm({
									...form,
									imageUrl: null
								}),
								children: "حذف عکس"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-mist",
							children: "بدون عکس هم در منو شکل طاق می‌ماند."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.isAvailable,
							onChange: (event) => setForm({
								...form,
								isAvailable: event.target.checked
							})
						}), "موجود است"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.isFeatured,
							onChange: (event) => setForm({
								...form,
								isFeatured: event.target.checked
							})
						}), "انتخاب خانه (نمایش بزرگ)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.isNew,
							onChange: (event) => setForm({
								...form,
								isNew: event.target.checked
							})
						}), "جدید"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					className: "flex-1",
					children: "ذخیره"
				}), item ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "danger",
					disabled: busy,
					onClick: remove,
					children: "حذف"
				}) : null]
			})
		]
	});
}
function CategoriesEditor({ menu, onMenu }) {
	const [nameFa, setNameFa] = (0, import_react.useState)("");
	const [nameEn, setNameEn] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [iconKey, setIconKey] = (0, import_react.useState)("cup");
	async function add(event) {
		event.preventDefault();
		try {
			onMenu(await createCategory({ data: {
				nameFa,
				nameEn,
				slug: slug || nameEn.toLowerCase().replace(/\s+/g, "-"),
				iconKey,
				sortOrder: menu.categories.length + 1
			} }));
			setNameFa("");
			setNameEn("");
			setSlug("");
			toast.success("دسته اضافه شد.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "اضافه نشد.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [menu.categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRow, {
			category,
			onMenu
		}, category.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: add,
			className: "rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: "دسته جدید"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "نام فارسی",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: nameFa,
								onChange: (event) => setNameFa(event.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "نام انگلیسی",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								dir: "ltr",
								value: nameEn,
								onChange: (event) => setNameEn(event.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "slug",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								dir: "ltr",
								value: slug,
								onChange: (event) => setSlug(event.target.value),
								placeholder: "espresso"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "آیکون",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-11 w-full rounded-[12px] bg-cream px-3 shadow-[var(--shadow-border)]",
								value: iconKey,
								onChange: (event) => setIconKey(event.target.value),
								children: ICON_KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: key,
									children: key
								}, key))
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-4",
					children: "افزودن دسته"
				})
			]
		})]
	});
}
function CategoryRow({ category, onMenu }) {
	const [nameFa, setNameFa] = (0, import_react.useState)(category.nameFa);
	const [nameEn, setNameEn] = (0, import_react.useState)(category.nameEn);
	const [slug, setSlug] = (0, import_react.useState)(category.slug);
	const [iconKey, setIconKey] = (0, import_react.useState)(category.iconKey);
	const [sortOrder, setSortOrder] = (0, import_react.useState)(category.sortOrder);
	async function save() {
		try {
			onMenu(await updateCategory({ data: {
				id: category.id,
				nameFa,
				nameEn,
				slug,
				iconKey,
				sortOrder
			} }));
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "نام فارسی",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: nameFa,
						onChange: (event) => setNameFa(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "نام انگلیسی",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: nameEn,
						onChange: (event) => setNameEn(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "slug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: slug,
						onChange: (event) => setSlug(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ترتیب",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						type: "number",
						value: sortOrder,
						onChange: (event) => setSortOrder(Number(event.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "آیکون",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-[12px] bg-cream px-3 shadow-[var(--shadow-border)]",
						value: iconKey,
						onChange: (event) => setIconKey(event.target.value),
						children: ICON_KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: key,
							children: key
						}, key))
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				onClick: save,
				children: "ذخیره"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "danger",
				onClick: remove,
				children: "حذف"
			})]
		})]
	});
}
function SettingsEditor({ menu, onMenu }) {
	const [cafeName, setCafeName] = (0, import_react.useState)(menu.settings.cafeName);
	const [taglineFa, setTaglineFa] = (0, import_react.useState)(menu.settings.taglineFa);
	const [taglineEn, setTaglineEn] = (0, import_react.useState)(menu.settings.taglineEn);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	async function saveSettings(event) {
		event.preventDefault();
		try {
			onMenu(await updateSettings({ data: {
				cafeName,
				taglineFa,
				taglineEn
			} }));
			toast.success("تنظیمات ذخیره شد.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "ذخیره نشد.");
		}
	}
	async function savePin(event) {
		event.preventDefault();
		const result = await updatePin({ data: {
			current,
			next
		} });
		if ("error" in result) {
			toast.error(result.error);
			return;
		}
		setCurrent("");
		setNext("");
		toast.success("کد ورود عوض شد.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: saveSettings,
			className: "rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: "هویت کافه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "نام",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cafeName,
								onChange: (event) => setCafeName(event.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "شعار فارسی",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: taglineFa,
								onChange: (event) => setTaglineFa(event.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "شعار انگلیسی",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								dir: "ltr",
								value: taglineEn,
								onChange: (event) => setTaglineEn(event.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-4",
					children: "ذخیره"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: savePin,
			className: "rounded-[24px] bg-cream/70 p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: "کد ورود مدیریت"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "کد فعلی",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: current,
							onChange: (event) => setCurrent(event.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "کد جدید",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: next,
							onChange: (event) => setNext(event.target.value),
							required: true,
							minLength: 4
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-4",
					children: "تغییر کد"
				})
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminPage as component };
