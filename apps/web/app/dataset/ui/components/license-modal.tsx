import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as Ic from '#common/ui/components/datarural/icons'

export interface LicenseModalProps {
  isOpen: boolean
  onClose: () => void
  licenseName: string
  licenseDescription?: string
}

interface LicenseDetails {
  fullName: string
  tag: string
  summary: string
  terms: string[]
  canCommercial: boolean
  canModify: boolean
  mustAttribute: boolean
  mustShareAlike: boolean
  linkUrl: string
}

const LICENSES_DATA: Record<string, LicenseDetails> = {
  'CC0-1.0': {
    fullName: 'CC0 1.0 Universal — Public Domain Dedication',
    tag: 'Domínio Público',
    summary: 'O autor renunciou a todos os direitos autorais e conexos, dedicando a obra ao domínio público em todo o mundo.',
    terms: [
      'Livre para uso pessoal, acadêmico ou comercial sem pedir autorização.',
      'Você pode copiar, modificar, distribuir e executar os dados livremente.',
      'A atribuição aos autores não é exigida por lei, porém recomendada por boas práticas científicas.',
    ],
    canCommercial: true,
    canModify: true,
    mustAttribute: false,
    mustShareAlike: false,
    linkUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.pt_BR',
  },
  'CC BY 4.0': {
    fullName: 'Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)',
    tag: 'Padrão para Dados Abertos',
    summary: 'Esta licença permite que outros distribuam, remixem, adaptem e criem a partir do seu trabalho, mesmo para fins comerciais, desde que lhe atribuam o devido crédito pela criação original.',
    terms: [
      'Compartilhar — copiar e redistribuir o material em qualquer suporte ou formato.',
      'Adaptar — remixar, transformar e criar a partir do material para qualquer fim, mesmo comercial.',
      'Atribuição — você deve dar o crédito apropriado, prover um link para a licença e indicar se mudanças foram feitas.',
    ],
    canCommercial: true,
    canModify: true,
    mustAttribute: true,
    mustShareAlike: false,
    linkUrl: 'https://creativecommons.org/licenses/by/4.0/deed.pt_BR',
  },
  'CC BY-SA 4.0': {
    fullName: 'Creative Commons Atribuição-CompartilhaIgual 4.0 (CC BY-SA 4.0)',
    tag: 'Compartilhamento Livre',
    summary: 'Permite reuso e adaptação, mesmo comercial, desde que seja atribuído crédito ao autor e as novas obras sejam licenciadas sob termos idênticos.',
    terms: [
      'Compartilhar e adaptar livremente para qualquer finalidade.',
      'CompartilhaIgual — se você remixar ou transformar o material, deve distribuir as suas contribuições sob a mesma licença do original.',
      'Atribuição obrigatória e indicação de modificações realizadas.',
    ],
    canCommercial: true,
    canModify: true,
    mustAttribute: true,
    mustShareAlike: true,
    linkUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR',
  },
  'CC BY-NC 4.0': {
    fullName: 'Creative Commons Atribuição-NãoComercial 4.0 (CC BY-NC 4.0)',
    tag: 'Não Comercial',
    summary: 'Permite remixar, adaptar e criar a partir do trabalho para fins não comerciais, com atribuição de crédito.',
    terms: [
      'Uso permitido exclusivamente para fins não comerciais (acadêmicos, pessoais ou públicos).',
      'Atribuição de crédito obrigatória ao autor original.',
    ],
    canCommercial: false,
    canModify: true,
    mustAttribute: true,
    mustShareAlike: false,
    linkUrl: 'https://creativecommons.org/licenses/by-nc/4.0/deed.pt_BR',
  },
  'MIT': {
    fullName: 'Licença MIT (MIT License)',
    tag: 'Permissiva',
    summary: 'Licença permissiva de software e dados que permite uso, cópia, modificação e redistribuição irrestrita mantendo o aviso de copyright.',
    terms: [
      'Uso livre comercial e privado sem restrições.',
      'Inclusão do aviso de direitos autorais em todas as cópias ou partes substanciais.',
    ],
    canCommercial: true,
    canModify: true,
    mustAttribute: true,
    mustShareAlike: false,
    linkUrl: 'https://opensource.org/licenses/MIT',
  },
}

export default function LicenseModal({
  isOpen,
  onClose,
  licenseName,
  licenseDescription,
}: LicenseModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  // Normalize key lookup
  const cleanKey = licenseName.replace(/[\s-]/g, '').toLowerCase()
  let details: LicenseDetails | null = null

  for (const [k, val] of Object.entries(LICENSES_DATA)) {
    if (k.replace(/[\s-]/g, '').toLowerCase() === cleanKey || cleanKey.includes(k.replace(/[\s-]/g, '').toLowerCase())) {
      details = val
      break
    }
  }

  // Default fallback if not found in dictionary
  if (!details) {
    details = {
      fullName: licenseName,
      tag: 'Licença do Conjunto de Dados',
      summary: licenseDescription || 'Licença definida pelo mantenedor para este conjunto de dados.',
      terms: [
        'Verifique os termos específicos com os mantenedores do conjunto de dados antes de reutilizá-lo em produtos derivados.',
      ],
      canCommercial: true,
      canModify: true,
      mustAttribute: true,
      mustShareAlike: false,
      linkUrl: '#',
    }
  }

  return createPortal(
    <div
      className="dr-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'drFadeIn 0.2s ease',
      }}
    >
      <div
        className="dr-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--card)',
          color: 'var(--foreground)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'drSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'color-mix(in srgb, var(--hero-bg) 80%, var(--card))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'color-mix(in srgb, var(--brand-sky) 15%, transparent)',
                color: 'var(--brand-sky)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ic.Scale size={20} />
            </span>
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--brand-sky)',
                }}
              >
                {details.tag}
              </span>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                {licenseName}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted-foreground)',
              padding: 6,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            title="Fechar"
          >
            <Ic.Plus size={20} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 6px', color: 'var(--foreground)' }}>
              {details.fullName}
            </h4>
            <p style={{ fontSize: 13.5, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.5 }}>
              {details.summary}
            </p>
          </div>

          {/* Key terms bullet points */}
          <div>
            <h5 style={{ fontSize: 12.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px', color: 'var(--muted-foreground)' }}>
              Principais Termos de Uso
            </h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--foreground)', lineHeight: 1.6 }}>
              {details.terms.map((term, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--secondary)',
          }}
        >
          {details.linkUrl && details.linkUrl !== '#' ? (
            <a
              href={details.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dr-link-more"
              style={{ fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              Ver texto legal completo <Ic.External size={14} />
            </a>
          ) : (
            <span style={{ fontSize: 12.5, color: 'var(--muted-foreground)' }}>Licença registrada na plataforma</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="dr-btn dr-btn-primary dr-btn-sm"
            style={{ padding: '8px 20px', borderRadius: 8 }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
