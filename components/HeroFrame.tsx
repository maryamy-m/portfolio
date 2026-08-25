'use client'

import { useEffect, useRef } from 'react'

/**
 * Hand-drawn double frame around the hero portrait.
 *
 * Two loose passes of the same rectangle, jittered and with corners that overrun,
 * so it reads as drawn rather than stroked. On scroll the two passes drift by
 * different amounts against the photo — an off-register print, not an animation
 * with a beginning and an end. There is no draw-on: the frame is fully present
 * at rest and only ever slides a few pixels.
 *
 * Paths are generated (jittered rect -> Catmull-Rom -> beziers), viewBox is the
 * portrait's 4:5 box, and the stroke is non-scaling so weight stays constant.
 */

const OUTER =
  'M 13.2 10.9 C 24.5 11.0, 59.8 10.9, 80.9 11.8 C 102.0 12.7, 116.5 14.3, 139.7 16.2 C 162.8 18.2, 196.1 23.9, 219.8 23.4 C 243.5 22.9, 261.3 14.6, 281.8 13.0 C 302.2 11.4, 322.6 14.3, 342.4 14.0 C 362.2 13.6, 380.0 9.0, 400.6 10.9 C 421.2 12.9, 442.6 23.6, 466.1 25.7 C 489.7 27.8, 535.0 25.7, 541.9 23.5 C 548.8 21.3, 514.6 -0.5, 507.4 12.5 C 500.2 25.4, 498.8 72.3, 498.6 101.3 C 498.4 130.3, 504.5 161.0, 506.2 186.4 C 507.9 211.8, 509.2 227.1, 508.8 253.6 C 508.5 280.0, 505.0 317.8, 503.9 345.1 C 502.8 372.4, 502.5 391.9, 502.1 417.2 C 501.7 442.5, 500.2 467.5, 501.5 496.6 C 502.8 525.7, 509.6 563.9, 509.8 591.6 C 510.0 619.2, 497.3 655.5, 502.9 662.4 C 508.4 669.4, 548.2 637.3, 543.4 633.3 C 538.5 629.3, 498.1 638.7, 473.9 638.3 C 449.7 637.8, 422.0 631.7, 398.2 630.5 C 374.3 629.2, 354.8 631.1, 330.8 630.8 C 306.7 630.4, 276.3 629.7, 253.9 628.5 C 231.5 627.3, 220.0 622.8, 196.6 623.8 C 173.3 624.7, 138.4 632.8, 113.8 634.3 C 89.2 635.7, 70.8 633.5, 49.0 632.6 C 27.3 631.8, -12.8 624.5, -16.5 629.2 C -20.2 633.8, 21.5 669.5, 27.0 660.5 C 32.4 651.6, 17.5 603.6, 16.4 575.4 C 15.3 547.2, 20.6 518.3, 20.4 491.5 C 20.2 464.7, 16.3 442.3, 15.4 414.7 C 14.5 387.1, 13.1 356.4, 14.8 326.1 C 16.4 295.7, 26.1 262.0, 25.3 232.6 C 24.5 203.2, 10.5 176.5, 10.1 149.6 C 9.7 122.7, 22.2 99.4, 22.8 71.3 C 23.3 43.2, 14.9 -4.0, 13.3 -19.0 C 11.7 -34.1, 13.3 -19.0, 13.3 -19.0'

const INNER =
  'M 27.9 30.3 C 37.6 29.3, 66.7 23.5, 86.2 24.3 C 105.7 25.0, 125.4 36.3, 145.2 34.9 C 164.9 33.6, 184.5 19.0, 204.6 16.3 C 224.7 13.6, 245.0 18.3, 265.7 18.7 C 286.5 19.2, 308.9 18.7, 329.0 18.9 C 349.0 19.1, 365.3 19.1, 385.9 20.2 C 406.4 21.3, 431.2 26.5, 452.1 25.5 C 473.0 24.6, 505.2 14.7, 511.4 14.6 C 517.7 14.5, 492.4 9.5, 489.5 24.9 C 486.5 40.4, 491.3 81.6, 493.5 107.1 C 495.8 132.7, 503.7 152.1, 502.7 178.1 C 501.6 204.1, 487.4 237.1, 487.2 263.0 C 487.0 288.9, 499.6 309.3, 501.6 333.7 C 503.7 358.1, 498.9 382.0, 499.5 409.6 C 500.1 437.2, 504.6 470.9, 505.1 499.3 C 505.6 527.7, 504.9 555.0, 502.4 580.0 C 499.9 604.9, 486.7 640.2, 490.1 649.0 C 493.6 657.8, 529.6 637.8, 523.1 632.6 C 516.6 627.5, 473.0 620.6, 451.1 618.0 C 429.2 615.5, 412.1 617.8, 391.8 617.3 C 371.4 616.8, 351.1 613.8, 329.0 615.2 C 306.9 616.5, 282.6 623.8, 259.0 625.6 C 235.4 627.3, 208.5 626.0, 187.1 625.6 C 165.8 625.2, 149.7 621.7, 131.0 623.1 C 112.3 624.5, 95.3 634.5, 75.2 634.1 C 55.1 633.6, 20.9 618.5, 10.6 620.4 C 0.3 622.3, 12.8 653.4, 13.6 645.3 C 14.4 637.2, 14.6 599.6, 15.5 571.8 C 16.4 543.9, 18.2 506.3, 18.8 478.3 C 19.4 450.3, 17.5 429.3, 19.2 403.6 C 21.0 377.9, 29.1 350.1, 29.2 324.1 C 29.2 298.2, 22.2 276.0, 19.6 248.2 C 17.1 220.3, 12.6 183.7, 14.0 157.1 C 15.4 130.5, 27.9 115.7, 28.1 88.3 C 28.3 60.9, 17.4 8.4, 15.2 -7.5 C 13.1 -23.5, 15.2 -7.5, 15.2 -7.5'

/** Peak drift in px at the bottom of the hero. Deliberately small. */
const DRIFT = 9

export default function HeroFrame() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const hero = el.closest('section')
      if (!hero) return
      const p = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1)
      el.style.setProperty('--d', (p * DRIFT).toFixed(2))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 650"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute -inset-5 z-10 h-[calc(100%+2.5rem)] w-[calc(100%+2.5rem)] mix-blend-multiply"
      style={{ ['--d' as string]: '0' }}
    >
      {/* the two passes drift by different amounts — that separation is the effect */}
      <path
        d={OUTER}
        fill="none"
        stroke="#00003c"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ transform: 'translate(calc(var(--d) * 1px), calc(var(--d) * 0.5px))' }}
      />
      <path
        d={INNER}
        fill="none"
        stroke="#00003c"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ transform: 'translate(calc(var(--d) * -0.6px), calc(var(--d) * -0.3px))' }}
      />
    </svg>
  )
}
