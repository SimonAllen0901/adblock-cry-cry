class AdBlockCryCry {
  constructor(options = {}) {
    const {
      img = "/ads.jpg",
      elementIds = [],
      gtmId = "",
      isCheckFacebook = true,
    } = options;

    this.img = img;
    this.gtmId = gtmId;
    this.isCheckFacebook = isCheckFacebook;
    this.elementIds = [
      "AdHeader",
      "AdContainer",
      "AD_Top",
      "homead",
      "ad-lead",
      "ads",
      "pub_300x250",
      "pub_300x250m",
      "pub_728x90",
      "text-ad",
      "textAd",
      "text_ad",
      "text_ads",
      "text-ads",
      "text-ad-links",
      "adBox",
      "adSlot",
      ...elementIds,
    ];
  }

  init(callback) {
    const dataContainer = document.createElement("div");
    dataContainer.innerHTML = this.generatesHTMLString();
    document.body.append(dataContainer);

    if (document.readyState === "complete") {
      if (callback && typeof callback === "function") {
        callback();
      }
    } else {
      window.addEventListener("load", () => {
        if (callback && typeof callback === "function") {
          callback();
        }
      });
    }
  }

  async detect() {
    try {
      let isAdBlockCryCry = false;
      let isFBBlocked = false;

      const isHTMLBlocked = this.elementIds.some((id) =>
        this.checkVisibilityHidden(id)
      );

      const isResourceBlocked = await this.checkBlockedResource();
      const isRequestBlocked = await this.checkBlockedRequests();
      const isGTMBlocked = await this.checkGTMBlocked();

      isAdBlockCryCry =
        isHTMLBlocked || isResourceBlocked || isRequestBlocked || isGTMBlocked;

      if (this.isCheckFacebook) {
        isFBBlocked = await this.checkFBlocked();
        isAdBlockCryCry = isAdBlockCryCry || isFBBlocked;
      }

      console.log({
        isHTMLBlocked,
        isResourceBlocked,
        isRequestBlocked,
        isGTMBlocked,
        isFBBlocked,
        isAdBlockCryCry,
      });

      this.elementIds.forEach((id) => {
        const element = document.querySelector(`#${id}`);
        if (element) {
          element.innerHTML = "";
        }
      });

      return isAdBlockCryCry;
    } catch (error) {
      console.error("Error during detection:", error);
      return false;
    }
  }

  generatesHTMLString() {
    return this.elementIds
      .map(
        (id) => `<div id="${id}" style=""><div id="${id}-child"></div></div>`
      )
      .join("");
  }

  checkVisibilityHidden(id) {
    const element = document.querySelector(`#${id}`);
    if (!element) return true;

    const style = getComputedStyle(element);

    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      parseFloat(style.opacity) === 0 ||
      style.height === "0px" ||
      style.width === "0px"
    ) {
      return true;
    }

    return false;
  }

  checkBlockedResource() {
    return new Promise((resolve) => {
      const fakeAd = document.createElement("img");
      fakeAd.src = `${this.img}?cache-buster=${Date.now()}`;
      fakeAd.onerror = () => resolve(true);
      fakeAd.onload = () => resolve(false);
      document.body.appendChild(fakeAd);
    });
  }

  checkBlockedRequests() {
    return new Promise((resolve) => {
      const randomPath = `/ads-${Date.now()}.js`;
      fetch(randomPath)
        .then(() => resolve(false))
        .catch(() => resolve(true));
    });
  }

  checkGTMBlocked() {
    if (!this.gtmId) return Promise.resolve(false);
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtm.js?id=${this.gtmId}`;
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          resolve(typeof window.google_tag_manager === "undefined");
        }, 500);
      };
      script.onerror = () => resolve(true);

      document.head.appendChild(script);
    });
  }

  checkFBlocked() {
    if (this.isCheckFacebook === false) return Promise.resolve(false);
    return new Promise(async (resolve) => {
      let scriptBlocked = false;
      let fetchBlocked = false;

      // 1. 檢查 <script> 是否能載入
      scriptBlocked = await new Promise((resolveScript) => {
        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        script.async = true;

        script.onload = () => resolveScript(false);
        script.onerror = () => resolveScript(true);

        document.head.appendChild(script);
      });

      // 2. 檢查 fetch 是否能請求 Facebook Pixel
      fetchBlocked = await new Promise((resolveFetch) => {
        fetch("https://connect.facebook.net/en_US/fbevents.js", {
          method: "HEAD",
          mode: "no-cors",
        })
          .then(() => resolveFetch(false))
          .catch(() => resolveFetch(true));
      });

      if (scriptBlocked || fetchBlocked) {
        console.log("Facebook Pixel blocked", { scriptBlocked, fetchBlocked });
      }

      resolve(scriptBlocked || fetchBlocked);
    });
  }
}
export default AdBlockCryCry;
