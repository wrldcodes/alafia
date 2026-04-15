import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 55%, #042f2e 100%)',
          color: '#ffffff',
          padding: '54px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '420px',
            height: '420px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-90px',
            left: '-100px',
            width: '320px',
            height: '320px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '62%',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                width: 'fit-content',
                padding: '10px 18px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Community health platform
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxWidth: '760px',
              }}
            >
              <div
                style={{
                  fontSize: '84px',
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                }}
              >
                Alafia
              </div>
              <div
                style={{
                  fontSize: '40px',
                  lineHeight: 1.15,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.94)',
                  maxWidth: '720px',
                }}
              >
                Book care, manage records, and support every community.
              </div>
              <div
                style={{
                  fontSize: '28px',
                  lineHeight: 1.4,
                  color: 'rgba(255,255,255,0.82)',
                  maxWidth: '690px',
                }}
              >
                Patients and clinics in one accessible health platform for local and rural care.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'fit-content',
              padding: '18px 28px',
              borderRadius: '999px',
              background: '#f8fafc',
              color: '#0f766e',
              fontSize: '28px',
              fontWeight: 800,
              boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            }}
          >
            Get started free
          </div>
        </div>

        <div
          style={{
            width: '34%',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            justifyContent: 'center',
          }}
        >
          {[
            ['For patients', 'Enroll, book visits, and view health records.'],
            ['For clinics', 'Manage appointments, teams, and billing.'],
            ['For communities', 'Accessible care with low-data friendly design.'],
          ].map(([title, body]) => (
            <div
              key={title}
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: '28px',
                padding: '24px',
                boxShadow: '0 14px 30px rgba(0,0,0,0.14)',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: '22px',
                  lineHeight: 1.35,
                  color: 'rgba(255,255,255,0.84)',
                }}
              >
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
