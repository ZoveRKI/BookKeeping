# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :login, mutation: Mutations::Login
    field :add_time, mutation: Mutations::AddTime
  end
end
