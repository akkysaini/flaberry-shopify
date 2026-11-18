/**
 * Flaberry Pincode & Delivery Location Serviceability Adapter
 * Architecture: Extensible client-side location state manager
 * Source of Truth: GEMINI.md & MASTER_STOREFRONT_IMPLEMENTATION_PLAN.md
 * Rule: Zero invented cities, pincodes, cutoffs or guarantees.
 * Status: Unverified until approved carrier/serviceability API is connected.
 */

class FlaberryLocationAdapter {
  constructor() {
    this.STORAGE_KEY = 'fl_postal_code';
    this.COUNTRY_KEY = 'fl_country_code';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.bindEvents();
      this.updateUI();
    });

    // Also run immediately if DOM is already ready
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      this.bindEvents();
      this.updateUI();
    }
  }

  getPostalCode() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  setPostalCode(code) {
    const sanitized = (code || '').trim().toUpperCase();
    try {
      if (sanitized) {
        localStorage.setItem(this.STORAGE_KEY, sanitized);
        document.cookie = `${this.STORAGE_KEY}=${encodeURIComponent(sanitized)};path=/;max-age=2592000;SameSite=Lax`;
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
        document.cookie = `${this.STORAGE_KEY}=;path=/;max-age=0;SameSite=Lax`;
      }
    } catch (e) {
      console.warn('FlaberryLocation: Local storage write failed', e);
    }

    this.updateUI();

    // Dispatch global event for other components (e.g. cart, PDP)
    window.dispatchEvent(
      new CustomEvent('flaberry:location-changed', {
        detail: { postalCode: sanitized, serviceability: this.checkServiceability(sanitized) },
      })
    );
  }

  /**
   * Extensible Serviceability Hook
   * Note: Shows "unverified" until an approved external API or dataset is connected.
   */
  checkServiceability(postalCode) {
    if (!postalCode) {
      return { status: 'none', verified: false, message: 'Please enter a delivery postal code.' };
    }
    return {
      status: 'unverified',
      verified: false,
      postalCode: postalCode,
      message: 'Serviceability unverified — delivery availability will be confirmed upon carrier connection.',
    };
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('#pinchip, [data-pinmodal]');
      if (chip) {
        e.preventDefault();
        this.openModal();
        return;
      }

      const closeBtn = e.target.closest('[data-pinclose], #pinmodal-scrim');
      if (closeBtn) {
        e.preventDefault();
        this.closeModal();
        return;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('pinmodal');
        if (modal && !modal.hasAttribute('hidden')) {
          this.closeModal();
        }
      }
    });

    const form = document.getElementById('pinmodal-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('pinmodal-input');
        if (input) {
          const val = input.value.trim();
          if (val) {
            this.setPostalCode(val);
            this.closeModal();
          }
        }
      });
    }

    const resetBtn = document.getElementById('pinmodal-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.setPostalCode('');
        this.closeModal();
      });
    }
  }

  openModal() {
    const modal = document.getElementById('pinmodal');
    if (!modal) return;
    modal.removeAttribute('hidden');
    modal.classList.add('is-open');
    document.body.classList.add('pinmodal-open');

    const input = document.getElementById('pinmodal-input');
    if (input) {
      input.value = this.getPostalCode();
      setTimeout(() => input.focus(), 50);
    }

    this.renderModalStatus();
  }

  closeModal() {
    const modal = document.getElementById('pinmodal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
    document.body.classList.remove('pinmodal-open');
  }

  renderModalStatus() {
    const statusContainer = document.getElementById('pinmodal-status');
    if (!statusContainer) return;

    const currentPin = this.getPostalCode();
    if (!currentPin) {
      statusContainer.innerHTML = '';
      return;
    }

    const result = this.checkServiceability(currentPin);
    statusContainer.innerHTML = `
      <div class="pinmodal-status-box pinmodal-status--unverified">
        <span class="pinmodal-status-badge">Location Set: ${this.escapeHtml(currentPin)}</span>
        <p class="pinmodal-status-desc">${this.escapeHtml(result.message)}</p>
      </div>
    `;
  }

  updateUI() {
    const currentPin = this.getPostalCode();
    const chips = document.querySelectorAll('#pinchip, .pinchip');

    chips.forEach((chip) => {
      const labelContainer = chip.querySelector('.pinchip-label') || chip;
      if (currentPin) {
        labelContainer.innerHTML = `
          <small class="pinchip-sub">Deliver to</small>
          <b class="pinchip-val">${this.escapeHtml(currentPin)}</b>
        `;
        chip.setAttribute('title', `Selected delivery location: ${currentPin} (Serviceability unverified)`);
        chip.classList.add('pinchip--has-val');
      } else {
        labelContainer.innerHTML = `
          <small class="pinchip-sub">Deliver to</small>
          <b class="pinchip-val">Select Location</b>
        `;
        chip.setAttribute('title', 'Select delivery postal code');
        chip.classList.remove('pinchip--has-val');
      }
    });

    this.renderModalStatus();
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// Instantiate singleton on window
window.FlaberryLocation = new FlaberryLocationAdapter();
