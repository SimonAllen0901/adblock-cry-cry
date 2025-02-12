class AdBlockCryCry {
  constructor({ img = "/ads.jpg", elementIds = [] }) {
    this.img = img;
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
    dataContainer.innerHTML = this.generatesBannersString();
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
      const isHTMLBlocked = this.elementIds.some((id) =>
        this.checkVisibilityHidden(id)
      );

      const isResourceBlocked = await this.checkBlockedResource();
      const isRequestBlocked = await this.checkBlockedRequests();

      console.log({
        isHTMLBlocked,
        isResourceBlocked,
        isRequestBlocked,
      });

      return isHTMLBlocked || isResourceBlocked || isRequestBlocked;
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

    const hasContent = Array.from(element.children).some(
      (child) => child.textContent.trim() !== ""
    );
    return !hasContent;
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
      const randomPath = `/ads.js`;
      fetch(randomPath)
        .then(() => resolve(false))
        .catch(() => resolve(true));
    });
  }
}
export default AdBlockCryCry;
