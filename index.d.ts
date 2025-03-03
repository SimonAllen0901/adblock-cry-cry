declare class AdBlockCryCry {
  constructor(options?: {
    img?: string;
    elementIds?: string[];
    gtmId?: string;
    isCheckFacebook?: boolean;
  });
  img: string;
  gtmId: string;
  isCheckFacebook: boolean;
  elementIds: string[];

  init(callback?: () => void): void;
  detect(): Promise<boolean>;
  generatesHTMLString(): string;
  checkVisibilityHidden(id: string): boolean;
  checkBlockedResource(): Promise<boolean>;
  checkBlockedRequests(): Promise<boolean>;
  checkGTMBlocked(): Promise<boolean>;
  checkFBlocked(): Promise<boolean>;
}
export default AdBlockCryCry;
