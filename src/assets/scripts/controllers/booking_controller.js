import { Controller } from "@hotwired/stimulus"
import { getMonths, getFutureDate } from '../helpers/shared'
import timekit from '../lib/timekit'
import * as MockData from './data.json';

export default class extends Controller {
  static values = {
    state: {
      type: Object,
      default: {
        year: '',
        month: '',
        day: '',
        date: '',
        monthsAvailableToBook: [],
        minimumTimeslotToBook: 2,
        timeslotSize: .5, // in hours
        bookings: []
      }
    }
  }

  connect() {
    const calendarElement = document.querySelector('[data-controller="booking-calendar"]');
    const monthsElement = document.querySelector('[data-controller="booking-months"]');
    const timeElement = document.querySelector('[data-controller="booking-time"]');

    if (!calendarElement || !monthsElement || !timeElement) console.error('Could not initialize booking component - missing necessary children elements')

    Promise.resolve().then(() => {
      this.bookingCalendarController = this.application.getControllerForElementAndIdentifier(calendarElement, 'booking-calendar')
      this.bookingMonthsController = this.application.getControllerForElementAndIdentifier(monthsElement, 'booking-months')
      this.bookingTimeController = this.application.getControllerForElementAndIdentifier(timeElement, 'booking-time')
      this.fetchAvailability()
    });
  }

  updateChildren() {
    this.bookingMonthsController.update(this.stateValue)
    this.bookingCalendarController.update(this.stateValue)
    this.bookingTimeController.update(this.stateValue)

    this.bookingTimeController.element.style.height = this.bookingCalendarController.element.offsetHeight + 'px'
  }

  selectMonth(event) {
    this.stateValue.year = Number(event.currentTarget.dataset.year)
    this.stateValue.month = Number(event.currentTarget.dataset.month)
    this.stateValue.day = ''
    this.stateValue.date = ''
    this.updateChildren()
  }

  selectDay(event) {
    this.stateValue.day = Number(event.currentTarget.dataset.day.substring(8,10))
    this.stateValue.date = `${this.stateValue.year}-${String(this.stateValue.month).padStart(2, '0')}-${String(this.stateValue.day).padStart(2,'0')}`
    this.updateChildren()
  }

  fetchAvailability() {
    // timekit.fetchAvailability(timekit.getConfig().availability)
    Promise.resolve(MockData)
      .then(response => {
        this.stateValue.monthsAvailableToBook = getMonths(getFutureDate(0), response.data[response.data.length - 1].end)
        this.stateValue.availability = this.parseAvailability(response.data)
        this.updateChildren()
      })
      .catch(error => {
        this.element.classList.add('has-fetch-error')
      })
  }

  parseAvailability(availability) {
    const parsedAvailability = {}

    availability.forEach(timeslot => {
      const timeslotMonth = timeslot.start.substring(0,7)
      const timeslotDay = timeslot.start.substring(8,10)

      if (!parsedAvailability[timeslotMonth]) parsedAvailability[timeslotMonth] = {}
      if (!parsedAvailability[timeslotMonth][timeslotDay]) parsedAvailability[timeslotMonth][timeslotDay] = []

      parsedAvailability[timeslotMonth][timeslotDay].push({ start: timeslot.start, end: timeslot.end })
    })

    return parsedAvailability
  }
}