"use client"

import * as React from "react"
import { format, subYears, isAfter, isBefore, startOfDay } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minAge?: number
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  minAge = 18,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const today = startOfDay(new Date())
  const maxDate = subYears(today, minAge)
  const minDate = new Date(1900, 0, 1)

  const [viewDate, setViewDate] = React.useState(value ?? maxDate)
  const [viewMonth, setViewMonth] = React.useState(viewDate.getMonth())
  const [viewYear, setViewYear] = React.useState(viewDate.getFullYear())
  const [activePanel, setActivePanel] = React.useState<"day" | "month" | "year">("day")

  React.useEffect(() => {
    if (open && value) {
      setViewDate(value)
      setViewMonth(value.getMonth())
      setViewYear(value.getFullYear())
    } else if (open) {
      setViewDate(maxDate)
      setViewMonth(maxDate.getMonth())
      setViewYear(maxDate.getFullYear())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  function isDateDisabled(day: number) {
    const date = new Date(viewYear, viewMonth, day)
    return isAfter(date, maxDate) || isBefore(date, minDate)
  }

  function isDateSelected(day: number) {
    if (!value) return false
    return (
      value.getDate() === day &&
      value.getMonth() === viewMonth &&
      value.getFullYear() === viewYear
    )
  }

  function isToday(day: number) {
    return day === todayDate && viewMonth === todayMonth && viewYear === todayYear
  }

  function handleSelectDay(day: number) {
    if (isDateDisabled(day)) return
    const selected = new Date(viewYear, viewMonth, day)
    onChange(selected)
    setOpen(false)
  }

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function handleNextMonth() {
    const nextDate = new Date(viewYear, viewMonth + 1, 1)
    if (isAfter(nextDate, maxDate)) return
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const canGoNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth())

  const yearRangeStart = Math.floor(viewYear / 12) * 12
  const yearRangeEnd = yearRangeStart + 11

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal input-class h-12",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
          {value ? (
            <span className="text-gray-900">{format(value, "MMMM d, yyyy")}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 rounded-xl border border-gray-200 shadow-lg" align="start">
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
            <div className="flex items-center justify-between">
              {activePanel === "day" && (
                <>
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActivePanel("month")}
                    className="text-sm font-semibold text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                  >
                    {MONTHS[viewMonth]}
                  </button>
                  <button
                    onClick={() => setActivePanel("year")}
                    className="text-sm font-semibold text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                  >
                    {viewYear}
                  </button>
                  <button
                    onClick={handleNextMonth}
                    disabled={!canGoNext}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              {activePanel === "month" && (
                <>
                  <div />
                  <span className="text-sm font-semibold text-white">{viewYear}</span>
                  <div />
                </>
              )}
              {activePanel === "year" && (
                <>
                  <button
                    onClick={() => setViewYear(yearRangeStart - 12)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-white">
                    {yearRangeStart} - {yearRangeEnd}
                  </span>
                  <button
                    onClick={() => setViewYear(yearRangeStart + 12)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Day Panel */}
          {activePanel === "day" && (
            <div className="p-3">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const disabled = isDateDisabled(day)
                  const selected = isDateSelected(day)
                  const todayMark = isToday(day)

                  return (
                    <button
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      disabled={disabled}
                      className={cn(
                        "h-9 w-full text-sm rounded-lg transition-all duration-150",
                        disabled && "text-gray-300 cursor-not-allowed",
                        !disabled && !selected && "hover:bg-blue-50 text-gray-700",
                        selected && "bg-blue-600 text-white font-semibold shadow-md",
                        todayMark && !selected && "ring-2 ring-blue-400 font-semibold text-blue-600"
                      )}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {/* Age restriction hint */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400">
                  You must be {minAge} or older to register
                </p>
              </div>
            </div>
          )}

          {/* Month Panel */}
          {activePanel === "month" && (
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, idx) => {
                  const isCurrentMonth = idx === todayMonth && viewYear === todayYear
                  const isSelected = idx === viewMonth
                  const isDisabled =
                    viewYear === maxDate.getFullYear() && idx > maxDate.getMonth()

                  return (
                    <button
                      key={month}
                      onClick={() => {
                        setViewMonth(idx)
                        setActivePanel("day")
                      }}
                      disabled={isDisabled}
                      className={cn(
                        "py-2.5 px-2 text-sm rounded-lg transition-all duration-150",
                        isDisabled && "text-gray-300 cursor-not-allowed",
                        !isDisabled && !isSelected && "hover:bg-blue-50 text-gray-700",
                        isSelected && "bg-blue-600 text-white font-semibold shadow-md",
                        isCurrentMonth && !isSelected && "ring-2 ring-blue-400 text-blue-600 font-semibold"
                      )}
                    >
                      {month.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Year Panel */}
          {activePanel === "year" && (
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const year = yearRangeStart + i
                  const isCurrentYear = year === todayYear
                  const isSelected = year === viewYear
                  const isDisabled = year > maxDate.getFullYear() || year < minDate.getFullYear()

                  return (
                    <button
                      key={year}
                      onClick={() => {
                        setViewYear(year)
                        setActivePanel("month")
                      }}
                      disabled={isDisabled}
                      className={cn(
                        "py-2.5 px-2 text-sm rounded-lg transition-all duration-150",
                        isDisabled && "text-gray-300 cursor-not-allowed",
                        !isDisabled && !isSelected && "hover:bg-blue-50 text-gray-700",
                        isSelected && "bg-blue-600 text-white font-semibold shadow-md",
                        isCurrentYear && !isSelected && "ring-2 ring-blue-400 text-blue-600 font-semibold"
                      )}
                    >
                      {year}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick select buttons */}
          <div className="px-3 pb-3 flex gap-2">
            <button
              onClick={() => {
                onChange(maxDate)
                setOpen(false)
              }}
              className="flex-1 text-xs py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors font-medium"
            >
              Today ({format(maxDate, "MMM d, yyyy")})
            </button>
            {value && (
              <button
                onClick={() => {
                  onChange(undefined)
                  setOpen(false)
                }}
                className="flex-1 text-xs py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
