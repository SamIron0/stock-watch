
export interface Bot {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  Net?: string;
}
export interface Stock {
  id: string,
  price_data?: string,
  vwap_data?: string
}

