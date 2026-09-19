export const categories = [
  { n: "01", name: "Business", slug: "business" },
  { n: "02", name: "Technology", slug: "technology" },
  { n: "03", name: "Creators", slug: "creators" },
  { n: "04", name: "Arts & Culture", slug: "arts-culture" },
  { n: "05", name: "Social Impact", slug: "social-impact" },
  { n: "06", name: "Health & Wellness", slug: "health-wellness" },
  { n: "07", name: "Science", slug: "science" },
  { n: "08", name: "Sports", slug: "sports" },
  { n: "09", name: "Education", slug: "education" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const portraits = {
  city: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80",
  writing: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
};

export type EditorialName = {
  slug: string;
  name: string;
  field: CategorySlug;
  fieldLabel: string;
  headline: string;
  honor?: string;
  photo: string;
  position: string;
  dek: string;
  quote?: string;
  body: string[];
  achievements: { text: string; verified: true }[];
};

export const coverStory: EditorialName = {
  slug: "malala-yousafzai",
  name: "Malala Yousafzai",
  field: "social-impact",
  fieldLabel: "Social Impact",
  headline: "Education activist",
  honor: "Nobel Peace Prize, 2014",
  photo: "/people/malala.jpg",
  position: "object-top",
  dek: "Shot for going to school. Honored for making sure other girls still can.",
  quote: "I raise up my voice — not so I can shout, but so those without a voice can be heard.",
  body: [
    "Malala Yousafzai was fifteen when the Taliban tried to end her education with a bullet. She survived, finished school, and turned the attack into a worldwide brief for girls’ classrooms.",
    "The Nobel committee did not invent her name. The world had already learned to say it. Names of Note files that public record so a search can find it beside names still being written.",
  ],
  achievements: [
    { text: "Nobel Peace Prize, 2014", verified: true },
    { text: "Co-founder, Malala Fund", verified: true },
  ],
};

export const famousNames: EditorialName[] = [
  {
    slug: "elon-musk",
    name: "Elon Musk",
    field: "business",
    fieldLabel: "Business",
    headline: "Industrialist",
    photo: "/people/elon.jpg",
    position: "object-[center_20%]",
    dek: "Tesla, SpaceX, and the wager that industry can still look like science fiction.",
    body: [
      "Elon Musk is filed here as an industrialist whose companies made electric cars and orbital launches ordinary arguments, not sci-fi.",
      "The record is public: product cycles, launches, and a personal brand the culture already indexes. This desk does not invent that fame. It keeps a page a search can open.",
    ],
    achievements: [
      { text: "CEO, Tesla and SpaceX", verified: true },
      { text: "First private crew orbital mission, 2020", verified: true },
    ],
  },
  {
    slug: "virat-kohli",
    name: "Virat Kohli",
    field: "sports",
    fieldLabel: "Sports",
    headline: "Batter",
    photo: "/people/kohli.jpg",
    position: "object-[center_15%]",
    dek: "India’s most watched batsman — discipline as a public fact.",
    body: [
      "Virat Kohli turned Test and limited-overs batting into a public standard: fitness, chase, and a following that treats form as news.",
      "The name was already a search term. The encyclopedia keeps the field, the work, and the line a reader can send.",
    ],
    achievements: [
      { text: "Former captain of India across formats", verified: true },
      { text: "ICC Cricketer of the Decade, 2010s (ODI)", verified: true },
    ],
  },
  {
    slug: "zendaya",
    name: "Zendaya",
    field: "arts-culture",
    fieldLabel: "Arts & Culture",
    headline: "Actor",
    photo: "/people/zendaya.jpg",
    position: "object-top",
    dek: "Euphoria to Dune: a face the culture now files as serious work.",
    body: [
      "Zendaya moved from Disney fame to roles the industry measures as adult work — television that argues, films that travel.",
      "The page is a public-figure stub: the field, the titles, and a dek a search can quote.",
    ],
    achievements: [
      { text: "Emmy Award, Euphoria", verified: true },
      { text: "Lead roles in Dune and Challengers", verified: true },
    ],
  },
  {
    slug: "jensen-huang",
    name: "Jensen Huang",
    field: "technology",
    fieldLabel: "Technology",
    headline: "Chip executive",
    photo: "/people/jensen.jpg",
    position: "object-[center_18%]",
    dek: "The leather jacket behind the chips that run modern AI.",
    body: [
      "Jensen Huang built Nvidia from graphics cards into the hardware layer most large AI models rent by the hour.",
      "The leather jacket is branding. The public fact is the GPU, the data-center, and a company the market already files next to the internet’s power bill.",
    ],
    achievements: [
      { text: "Co-founder and CEO, Nvidia", verified: true },
      { text: "CUDA and data-center GPUs that run modern AI training", verified: true },
    ],
  },
  {
    slug: "sundar-pichai",
    name: "Sundar Pichai",
    field: "technology",
    fieldLabel: "Technology",
    headline: "Chief executive",
    photo: "/people/sundar.jpg",
    position: "object-[center_left]",
    dek: "From Chennai to Google’s chair — the quiet operator of the open web.",
    body: [
      "Sundar Pichai ran Chrome, then Android, then Google, then Alphabet — a career the industry reads as operator, not founder myth.",
      "Chennai to Mountain View is already a public story. This desk files the title, the field, and the dek.",
    ],
    achievements: [
      { text: "CEO of Google and Alphabet", verified: true },
      { text: "Led Chrome and Android before the top job", verified: true },
    ],
  },
  {
    slug: "ratan-tata",
    name: "Ratan Tata",
    field: "business",
    fieldLabel: "Business",
    headline: "Industrialist",
    photo: "/people/ratan.jpg",
    position: "object-[center_20%]",
    dek: "The industrialist India still measures other names against.",
    body: [
      "Ratan Tata chaired Tata Sons through global acquisitions and a domestic standard of what a house name is supposed to mean.",
      "The encyclopedia records a public life already taught in business pages — not a listing for sale.",
    ],
    achievements: [
      { text: "Former chairman, Tata Sons", verified: true },
      { text: "Led Tata’s global expansion including Tetley, Corus, and JLR", verified: true },
    ],
  },
];

export const encyclopedia = [coverStory, ...famousNames];

export function editorialBySlug(slug: string) {
  return encyclopedia.find((person) => person.slug === slug) ?? null;
}
