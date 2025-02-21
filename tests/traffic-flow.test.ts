import { describe, it, beforeEach, expect } from "vitest"

describe("Traffic Flow Contract", () => {
  let mockStorage: Map<string, any>
  let currentBlockHeight: number
  
  beforeEach(() => {
    mockStorage = new Map()
    currentBlockHeight = 100
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "update-traffic-data":
        const [intersectionId, vehiclesCount, averageSpeed] = args
        mockStorage.set(`traffic-${intersectionId}`, {
          vehicles_count: vehiclesCount,
          average_speed: averageSpeed,
          last_updated: currentBlockHeight,
        })
        return { success: true }
      
      case "get-traffic-data":
        return { success: true, value: mockStorage.get(`traffic-${args[0]}`) }
      
      case "calculate-congestion-level":
        const data = mockStorage.get(`traffic-${args[0]}`)
        if (!data) return { success: false, error: 404 }
        let congestionLevel = "low"
        if (data.vehicles_count > 50) {
          congestionLevel = data.average_speed < 30 ? "high" : "medium"
        }
        return { success: true, value: congestionLevel }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should update traffic data", () => {
    const result = mockContractCall("update-traffic-data", ["INT001", 30, 40], "user1")
    expect(result.success).toBe(true)
  })
  
  it("should get traffic data", () => {
    mockContractCall("update-traffic-data", ["INT001", 30, 40], "user1")
    const result = mockContractCall("get-traffic-data", ["INT001"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      vehicles_count: 30,
      average_speed: 40,
      last_updated: 100,
    })
  })
  
  it("should calculate congestion level - low", () => {
    mockContractCall("update-traffic-data", ["INT001", 30, 40], "user1")
    const result = mockContractCall("calculate-congestion-level", ["INT001"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe("low")
  })
  
  it("should calculate congestion level - medium", () => {
    mockContractCall("update-traffic-data", ["INT001", 60, 35], "user1")
    const result = mockContractCall("calculate-congestion-level", ["INT001"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe("medium")
  })
  
  it("should calculate congestion level - high", () => {
    mockContractCall("update-traffic-data", ["INT001", 80, 20], "user1")
    const result = mockContractCall("calculate-congestion-level", ["INT001"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe("high")
  })
})

