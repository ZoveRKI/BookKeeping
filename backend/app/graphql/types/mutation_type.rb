# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :login, mutation: Mutations::Login
    field :add_time, mutation: Mutations::AddTime
    field :save_row_data, mutation: Mutations::SaveRowData
    field :delete_row_data, mutation: Mutations::DeleteRowData
  end
end
