;; Accident Response Contract

(define-map accidents
  { accident-id: uint }
  {
    location: (string-ascii 50),
    severity: (string-ascii 10),
    status: (string-ascii 20),
    reported-by: principal,
    reported-at: uint
  }
)

(define-data-var next-accident-id uint u0)

(define-public (report-accident (location (string-ascii 50)) (severity (string-ascii 10)))
  (let
    ((accident-id (+ (var-get next-accident-id) u1)))
    (var-set next-accident-id accident-id)
    (ok (map-set accidents
      { accident-id: accident-id }
      {
        location: location,
        severity: severity,
        status: "reported",
        reported-by: tx-sender,
        reported-at: block-height
      }
    ))
  )
)

(define-public (update-accident-status (accident-id uint) (new-status (string-ascii 20)))
  (let
    ((accident (unwrap! (map-get? accidents { accident-id: accident-id }) (err u404))))
    (ok (map-set accidents
      { accident-id: accident-id }
      (merge accident { status: new-status })
    ))
  )
)

(define-read-only (get-accident (accident-id uint))
  (map-get? accidents { accident-id: accident-id })
)

