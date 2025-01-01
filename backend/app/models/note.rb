class Note < ApplicationRecord
  belongs_to :additional_expense

  validates :note, presence: true
end
