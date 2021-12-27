import { Controller } from '@hotwired/stimulus'
import { toCurrency, toReadableDate, toReadableHour } from '../helpers/shared'

export default class extends Controller {
  static targets = [
    "bookingTime",
    "cleaningProductPrice",
    "cleaningProductTitle",
    "cleaningProductDescription",
    "spaceProductPrice",
    "spaceProductQuantity",
    "spaceProductTitle",
    "spaceProductDescription",
    "estimatedTotal",
  ]

  connect() {
    this.spaceProduct = null
    this.spaceProductQuantity = 2
    this.cleaningProduct = null
  }

  update(event) {
    const data = event.detail

    if (!event.detail) return

    if (data.cleaningProduct) this.cleaningProduct = data.cleaningProduct
    if (data.spaceProduct) this.spaceProduct = data.spaceProduct
    if (data.quantity) this.spaceProductQuantity = data.quantity
    if (data.startTime) this.bookingStartTime = data.startTime
    if (data.endTime) this.bookingEndTime = data.endTime

    if (!this.spaceProduct || !this.cleaningProduct) return;

    this.renderCleaningProduct(this.cleaningProduct)
    this.renderSpaceProduct(this.spaceProduct, this.spaceProductQuantity)
    if (this.bookingStartTime && this.bookingEndTime) this.renderBookingTime(this.bookingStartTime, this.bookingEndTime)

    const estimatedTotal = this.calculateEstimatedTotal(this.cleaningProduct, this.spaceProduct, this.spaceProductQuantity)
    this.renderEstimatedTotal(estimatedTotal)
  }

  calculateEstimatedTotal(cleaningProduct, spaceProduct, spaceProductQuantity = 2) {
    return cleaningProduct.price.unit_amount + (spaceProductQuantity * spaceProduct.price.unit_amount)
  }

  renderEstimatedTotal(amount, currency) {
    if (this.hasEstimatedTotalTarget) this.estimatedTotalTarget.innerText = toCurrency(amount, currency)
  }

  renderBookingTime(start, end) {
    if (!this.hasBookingTimeTarget) return

    this.bookingTimeTarget.innerText = `${toReadableDate(start)} from  ${toReadableHour(start)} to ${toReadableHour(end)}`
  }

  renderCleaningProduct(product) {
    if (this.hasCleaningProductPriceTarget) this.renderCleaningProductPrice(product.price.unit_amount, product.price.currency)
    if (this.hasCleaningProductTitleTarget) this.renderCleaningProductTitle(product.name)
    if (this.hasCleaningProductDescriptionTarget) this.renderCleaningProductDescription(product.description)
  }

  renderCleaningProductPrice(amount, currency) {
    this.cleaningProductPriceTarget.innerText = toCurrency(amount, currency)
  }

  renderCleaningProductTitle(title) {
    this.cleaningProductTitleTarget.innerText = title
  }

  renderCleaningProductDescription(description) {
    this.cleaningProductDescriptionTarget.innerText = description
  }

  renderSpaceProduct(product, quantity) {
    if (this.hasSpaceProductPriceTarget) this.renderSpaceProductPrice(product.price.unit_amount * quantity, product.price.currency)
    if (this.hasSpaceProductTitleTarget) this.renderSpaceProductTitle(product.name)
    if (this.hasSpaceProductDescriptionTarget) this.renderSpaceProductDescription(product.description)
    if (this.hasSpaceProductQuantityTarget && quantity) this.renderSpaceProductQuantity(quantity)
  }

  renderSpaceProductPrice(amount, currency) {
    this.spaceProductPriceTarget.innerText = toCurrency(amount, currency)
  }

  renderSpaceProductTitle(title) {
    this.spaceProductTitleTarget.innerText = title
  }

  renderSpaceProductDescription(description) {
    this.spaceProductDescriptionTarget.innerText = description
  }

  renderSpaceProductQuantity(quantity) {
    this.spaceProductQuantityTarget.innerText = `(${quantity/2} hour${quantity/2 > 1 ? 's' : ''})`
  }
}
