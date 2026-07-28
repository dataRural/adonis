import { useForm } from '@inertiajs/react'
import React, { useRef, useState } from 'react'

import { UserAvatar } from '#common/ui/components/user_avatar'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'
import { Progress } from '@workspace/ui/components/progress'
import { toast } from '@workspace/ui/hooks/use-toast'

import type { Data } from '@generated/data'

interface Props {
  user: Data.Users.User
}

export function ProfileForm({ user }: Props) {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data, setData, errors, post, progress } = useForm({
    fullName: user.fullName ?? '',
    bio: (user as any).bio ?? '',
    institution: (user as any).institution ?? '',
    location: (user as any).location ?? '',
    avatar: null as File | null,
  })

  const avatarInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setData('avatar', file)
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    post(urlFor('profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        setPreviewUrl(null)

        toast(t('users.action.toast.type_success'), {
          description: t('users.action.toast.settings_updated', {
            setting: t('users.layout.profile'),
          }),
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <FieldSet>
        <FieldGroup>
          <Field>
            <div className="col-span-full flex items-center gap-x-8">
              <UserAvatar
                user={{ ...user, avatarUrl: previewUrl ?? user.avatarUrl }}
                className="size-24 flex-none rounded-lg object-cover"
              />

              <div>
                <Button type="button" onClick={() => avatarInputRef.current?.click()}>
                  {t('users.action.actions.change_avatar')}
                </Button>
                <p className="mt-2 text-xs/5">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <Input
              ref={avatarInputRef}
              id="avatar"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <FieldErrorBag errors={errors} field="avatar" />
          </Field>

          <Field>
            <FieldLabel htmlFor="fullName">{t('users.action.form.full_name.label')}</FieldLabel>
            <Input
              id="fullName"
              placeholder={t('users.action.form.full_name.placeholder')}
              value={data.fullName}
              onChange={(e) => setData('fullName', e.target.value)}
              className={errors?.fullName ? 'border-destructive' : ''}
            />
            <FieldErrorBag errors={errors} field="fullName" />
          </Field>

          <Field>
            <FieldLabel htmlFor="bio">Biografia</FieldLabel>
            <textarea
              id="bio"
              rows={3}
              placeholder="Escreva uma breve biografia para o seu perfil público..."
              value={data.bio}
              onChange={(e) => setData('bio', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <FieldErrorBag errors={errors} field="bio" />
          </Field>

          <Field>
            <FieldLabel htmlFor="institution">Instituição / Unidade</FieldLabel>
            <Input
              id="institution"
              placeholder="Ex: Instituto de Ciências Exatas — UFRRJ"
              value={data.institution}
              onChange={(e) => setData('institution', e.target.value)}
              className={errors?.institution ? 'border-destructive' : ''}
            />
            <FieldErrorBag errors={errors} field="institution" />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Localização</FieldLabel>
            <Input
              id="location"
              placeholder="Ex: Seropédica, Rio de Janeiro"
              value={data.location}
              onChange={(e) => setData('location', e.target.value)}
              className={errors?.location ? 'border-destructive' : ''}
            />
            <FieldErrorBag errors={errors} field="location" />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">{t('users.action.form.email.label')}</FieldLabel>
            <p id="email">{user.email}</p>
          </Field>

          {progress && (
            <Field>
              <Progress value={progress.percentage} max={100} className="w-full h-2 rounded mt-2" />
            </Field>
          )}

          <Field orientation="responsive">
            <Button type="submit">{t('users.action.actions.save')}</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
