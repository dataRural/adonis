import type { HttpContext } from '@adonisjs/core/http'

import Group from '#app/groups/models/group'
import Dataset from '#app/dataset/models/dataset'
import GroupPolicy from '#app/groups/policies/group_policy'
import { assignDatasetToGroupValidator } from '#app/groups/validators'

export default class GroupDatasetsController {
  /**
   * Assign an existing dataset to a group.
   * The dataset must be owned by the current user, and the user must be
   * at least an editor in the group.
   */
  public async store({ auth, params, request, response, session }: HttpContext) {
    const currentUser = auth.user!
    const group = await Group.findOrFail(params.id)

    const policy = new GroupPolicy()
    if (!(await policy.manageDatasets(currentUser, group))) {
      return response.forbidden('Você não tem permissão para adicionar datasets neste grupo.')
    }

    const payload = await request.validateUsing(assignDatasetToGroupValidator)

    const dataset = await Dataset.find(payload.datasetId)
    if (!dataset) {
      session.flash('error', 'Dataset não encontrado.')
      return response.redirect().back()
    }

    // Only the dataset owner can assign it to a group
    if (dataset.userId !== currentUser.id) {
      return response.forbidden('Apenas o criador do dataset pode adicioná-lo a um grupo.')
    }

    dataset.groupId = group.id
    await dataset.save()

    session.flash('success', `Dataset "${dataset.name}" adicionado ao grupo!`)
    return response.redirect().back()
  }

  /**
   * Remove a dataset from the group (set group_id to null).
   */
  public async destroy({ auth, params, response, session }: HttpContext) {
    const currentUser = auth.user!
    const group = await Group.findOrFail(params.id)

    const policy = new GroupPolicy()
    if (!(await policy.manageDatasets(currentUser, group))) {
      return response.forbidden('Você não tem permissão para remover datasets deste grupo.')
    }

    const dataset = await Dataset.query()
      .where('id', params.datasetId)
      .where('groupId', group.id)
      .firstOrFail()

    dataset.groupId = null
    await dataset.save()

    session.flash('success', `Dataset "${dataset.name}" removido do grupo.`)
    return response.redirect().back()
  }
}
