# app/channels/neworder_channel.rb
class NeworderChannel < ApplicationCable::Channel
    # Called when the consumer has successfully
    # become a subscriber to this channel.
    def subscribed
      logger.debug "NeworderChannel class - subscribed called"
      stream_from "neworder_channel"
    end
end