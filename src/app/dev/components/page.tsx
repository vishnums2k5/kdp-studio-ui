"use client";

import { useState } from "react";
import {
  Badge,
  Banner,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  EmptyState,
  Field,
  Input,
  Kbd,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioItem,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  Td,
  Textarea,
  Th,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToastProvider,
  useToast,
  Avatar,
} from "@/components/ui";
import { useTheme } from "@/lib/theme";
import { themes } from "@/styles/tokens";
import { Sun, Moon, Download, Plus } from "lucide-react";

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {note && <p className="mt-1 text-sm text-ink-2">{note}</p>}
      </header>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-3">
        {label}
      </span>
      {children}
    </div>
  );
}

function GalleryInner() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [colorMode, setColorMode] = useState<"color" | "bw">("color");
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(false);
  const [sliderVal, setSliderVal] = useState([40]);
  const [combo, setCombo] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(2);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KDP Studio — Component gallery</h1>
          <p className="mt-1 text-sm text-ink-2">
            Every base component in every state, both themes. Gate artifact for Phase 1.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </Button>
      </header>

      <Section title="Colors" note="Role tokens, light + dark. Original palette — same roles as reference, own values.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(themes[theme === "dark" ? "dark" : "light"]).map(([name, val]) => (
            <div key={name} className="flex items-center gap-2 rounded-md border border-line p-2">
              <span className="size-8 shrink-0 rounded-sm border border-line" style={{ background: val }} />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{name}</p>
                <p className="text-[10px] text-ink-3">{val}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" note="DM Sans (OFL). Scale 12/13/14/16/20/24/30.">
        <p className="text-3xl font-bold">Title 30 Bold</p>
        <p className="text-2xl font-bold">Title 24 Bold</p>
        <p className="text-xl font-bold">Heading 20 Bold</p>
        <p className="text-lg">Body large 16</p>
        <p className="text-base">Body 14 — the app default. Books, checks, panels.</p>
        <p className="text-sm">Secondary 13 — helper text, meta.</p>
        <p className="text-xs text-ink-3">Caption 12 — labels, counters.</p>
      </Section>

      <Section title="Buttons">
        <Row label="Variants">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="danger-ghost">Delete</Button>
          <Button variant="secondary"><Download /> With icon</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </Row>
        <Row label="Sizes">
          <Button size="xs">XS</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button variant="icon" aria-label="Add"><Plus /></Button>
        </Row>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-md gap-4">
          <Field label="Book title" required counter="0 / 200 characters (KDP limit)" enhanceAIArea>
            <Input placeholder="Enter your kids book title…" />
          </Field>
          <Field label="Story description" error="This field is required" enhanceAIArea>
            <Textarea placeholder="Describe the adventure, setting, and what happens in your story…" invalid />
          </Field>
          <Field label="Disabled" hint="Hint text under the field">
            <Input disabled placeholder="Not editable" />
          </Field>
        </div>
      </Section>

      <Section title="Controls">
        <Row label="Checkbox">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)} id="cb1" />
          <Checkbox indeterminate id="cb2" />
          <Checkbox disabled id="cb3" />
        </Row>
        <Row label="Radio">
          <RadioGroup defaultValue="a" className="flex gap-4">
            <RadioItem value="a" id="r1" /> <span className="text-sm">Option A</span>
            <RadioItem value="b" id="r2" /> <span className="text-sm">Option B</span>
          </RadioGroup>
        </Row>
        <Row label="Switch">
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} id="sw1" />
          <Switch disabled id="sw2" />
        </Row>
        <Row label="Slider">
          <Slider value={sliderVal} onValueChange={setSliderVal} max={100} className="max-w-64" />
          <span className="text-sm text-ink-2">{sliderVal[0]}%</span>
        </Row>
        <Row label="Select">
          <Select
            className="max-w-56"
            placeholder="Answers per page"
            options={[
              { value: "1", label: "1 per page" },
              { value: "4", label: "4 per page" },
              { value: "8", label: "8 per page" },
            ]}
          />
        </Row>
        <Row label="Combobox">
          <Combobox
            className="max-w-56"
            value={combo}
            onValueChange={setCombo}
            options={[
              { value: "bold-easy", label: "Bold and Easy" },
              { value: "mandala", label: "Mandala" },
              { value: "cartoon", label: "Cartoon" },
              { value: "stained", label: "Stained Glass" },
            ]}
          />
        </Row>
        <Row label="Segmented">
          <Segmented
            ariaLabel="Color mode"
            value={colorMode}
            onValueChange={setColorMode}
            options={[
              { value: "color", label: "Color" },
              { value: "bw", label: "B&W" },
            ]}
          />
        </Row>
        <Row label="Chip"><Chip>Suggestion chip</Chip><Chip onClick={() => {}}>Clickable</Chip></Row>
        <Row label="Kbd"><span className="text-sm">Undo <Kbd>⌘</Kbd><Kbd>Z</Kbd></span></Row>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-6">
                <DialogTitle>Example dialog</DialogTitle>
                <DialogDescription className="mt-1.5">
                  Modals close on Escape or overlay click; focus is trapped and restored.
                </DialogDescription>
                <div className="mt-5 flex justify-end gap-2">
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <DialogClose asChild><Button>Confirm</Button></DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Popover>
            <PopoverTrigger asChild><Button variant="secondary">Open popover</Button></PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <p className="text-sm font-medium">Popover</p>
              <p className="mt-1 text-sm text-ink-2">Anchored, closes on outside click or Escape.</p>
            </PopoverContent>
          </Popover>
          <Button variant="secondary" onClick={() => toast({ kind: "success", title: "Saved", description: "All changes saved automatically." })}>
            Toast: success
          </Button>
          <Button variant="secondary" onClick={() => toast({ kind: "warning", title: "Credit estimate", description: "This action will use 8 credits." })}>
            Toast: warning
          </Button>
          <Button variant="secondary" onClick={() => toast({ kind: "error", title: "Generation failed", description: "1 credit refunded automatically." })}>
            Toast: error
          </Button>
        </div>
      </Section>

      <Section title="Display">
        <Row label="Badges">
          <Badge>Neutral</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="accent">Accent</Badge>
        </Row>
        <Row label="Avatar">
          <Avatar name="Ada Byrd" size="sm" />
          <Avatar name="Ada Byrd" />
          <Avatar name="Ada Byrd" size="lg" />
        </Row>
        <Row label="Progress"><Progress value={64} className="max-w-64" label="Export progress" /></Row>
        <Row label="Spinner"><Spinner /></Row>
        <Row label="Skeleton"><div className="flex gap-3"><Skeleton className="h-14 w-24" /><Skeleton className="h-14 w-40" /><Skeleton className="h-14 w-40" /></div></Row>
        <Table className="max-w-xl rounded-md border border-line">
          <thead>
            <tr><Th>Title</Th><Th>BSR</Th><Th>Price</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Farm animals coloring book</Td><Td>446,533</Td><Td>$7.81</Td></tr>
            <tr><Td>Ocean mandalas</Td><Td>112,004</Td><Td>$6.99</Td></tr>
          </tbody>
        </Table>
        <Pagination page={page} pageCount={7} onPageChange={setPage} className="justify-start" />
        <EmptyState
          title="No books yet"
          description="Books you create will appear here."
          action={<Button size="sm">Create your first book</Button>}
        />
        <Banner tone="warning" title="2 things to fix before KDP">
          KDP&apos;s published trim, bleed, margin and page-count rules. Amazon&apos;s Previewer makes the final check when you upload.
        </Banner>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="pt-3 text-sm text-ink-2">Edit tab content.</TabsContent>
          <TabsContent value="details" className="pt-3 text-sm text-ink-2">Details tab content.</TabsContent>
        </Tabs>
      </Section>
    </div>
  );
}

export default function DevComponentsPage() {
  return (
    <ToastProvider>
      <GalleryInner />
    </ToastProvider>
  );
}
