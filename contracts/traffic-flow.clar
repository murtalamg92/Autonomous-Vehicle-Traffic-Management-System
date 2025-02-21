;; Traffic Flow Contract

(define-map traffic-data
  { intersection-id: (string-ascii 20) }
  {
    vehicles-count: uint,
    average-speed: uint,
    last-updated: uint
  }
)

(define-public (update-traffic-data (intersection-id (string-ascii 20)) (vehicles-count uint) (average-speed uint))
  (ok (map-set traffic-data
    { intersection-id: intersection-id }
    {
      vehicles-count: vehicles-count,
      average-speed: average-speed,
      last-updated: block-height
    }
  ))
)

(define-read-only (get-traffic-data (intersection-id (string-ascii 20)))
  (map-get? traffic-data { intersection-id: intersection-id })
)

(define-read-only (calculate-congestion-level (intersection-id (string-ascii 20)))
  (let
    ((data (unwrap! (map-get? traffic-data { intersection-id: intersection-id }) (err u404))))
    (ok (if (> (get vehicles-count data) u50)
          (if (< (get average-speed data) u30) "high" "medium")
          "low"))
  )
)

