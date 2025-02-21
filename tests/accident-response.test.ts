import { describe, it, beforeEach, expect } from "vitest"

describe("Accident Response Contract", () => {
  let mockStorage: Map<string, any>
  let nextAccidentId: number
  let currentBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextAccidentId = 0
    currentBlockHeight = 100
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "report-accident":
        const [location, severity] = args
        nextAccidentId++
        mockStorage.set(`accident-${nextAccidentId}`, {
          location: location,
          severity: severity,
          status: "reported",
          reported_by: sender,
          reported_at: currentBlockHeight,
        })
        return { success: true, value: nextAccidentId }
      
      case "update-accident-status":
        const [accidentId, newStatus] = args
        const accident = mockStorage.get(`accident-${accidentId}`)
        if (!accident) return { success: false, error: 404 }
        accident.status = newStatus
        mockStorage.set(`accident-${accidentId}`, accident)
        return { success: true }
      
      case "get-accident":
        return { success: true, value: mockStorage.get(`accident-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should report an accident", () => {
    const result = mockContractCall("report-accident", ["Main St & 1st Ave", "moderate"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should update accident status", () => {
    mockContractCall("report-accident", ["Main St & 1st Ave", "moderate"], "user1")
    const result = mockContractCall("update-accident-status", [1, "resolved"], "user2")
    expect(result.success).toBe(true)
  })
  
  it("should get accident information", () => {
    mockContractCall("report-accident", ["Main St & 1st Ave", "moderate"], "user1")
    const result = mockContractCall("get-accident", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      location: "Main St & 1st Ave",
      severity: "moderate",
      status: "reported",
      reported_by: "user1",
      reported_at: 100,
    })
  })
})

