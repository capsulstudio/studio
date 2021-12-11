import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['overlay'];

  connect() {
  }

  open() {
    this.overlayTarget.classList.add('is-visible');
  }

  close() {
    this.overlayTarget.classList.remove('is-visible');
  }
}
