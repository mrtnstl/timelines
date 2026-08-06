export interface TimelineLink {
  id: string;
  label: string;
  href: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  links?: TimelineLink[];
}

export interface Timeline {
  id: string;
  ownerId: string;
  title: string;
  events: TimelineEvent[];
  isPublished: boolean;
  publicId?: string;
}
