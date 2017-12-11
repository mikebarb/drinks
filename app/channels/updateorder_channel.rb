class UpdateorderChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
      logger.debug "UpdateorderChannel class - subscribed called"
      stream_from "updateorder_channel"
  end
end
