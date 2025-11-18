export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: PostInsert
        Update: PostUpdate
      }
    }
  }
}

export interface Post {
  id: string
  created_at: string
  updated_at: string
  original_image_url: string
  processed_image_url: string | null
  has_white_background: boolean
  company_logo_url: string | null
  company_logo_position: LogoPosition
  price: number | null
  price_badge_position: BadgePosition
  price_badge_style: BadgeStyle
  border_enabled: boolean
  border_width: number
  border_color: string
  border_style: string
  title: string | null
  description: string | null
  tags: string[] | null
  user_id: string | null
  is_published: boolean
}

export interface PostInsert {
  id?: string
  created_at?: string
  updated_at?: string
  original_image_url: string
  processed_image_url?: string | null
  has_white_background?: boolean
  company_logo_url?: string | null
  company_logo_position?: LogoPosition
  price?: number | null
  price_badge_position?: BadgePosition
  price_badge_style?: BadgeStyle
  border_enabled?: boolean
  border_width?: number
  border_color?: string
  border_style?: string
  title?: string | null
  description?: string | null
  tags?: string[] | null
  user_id?: string | null
  is_published?: boolean
}

export interface PostUpdate {
  id?: string
  created_at?: string
  updated_at?: string
  original_image_url?: string
  processed_image_url?: string | null
  has_white_background?: boolean
  company_logo_url?: string | null
  company_logo_position?: LogoPosition
  price?: number | null
  price_badge_position?: BadgePosition
  price_badge_style?: BadgeStyle
  border_enabled?: boolean
  border_width?: number
  border_color?: string
  border_style?: string
  title?: string | null
  description?: string | null
  tags?: string[] | null
  user_id?: string | null
  is_published?: boolean
}

export interface LogoPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface BadgePosition {
  x: number
  y: number
  width: number
  height: number
}

export interface BadgeStyle {
  backgroundColor: string
  textColor: string
  fontSize: number
}
