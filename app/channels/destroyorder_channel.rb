class DestroyorderChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    logger.debug "DestroyorderChannel class - subscribed called"
    stream_from "destroyorder_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
