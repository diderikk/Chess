defmodule BackendWeb.LobbyChannel do
  use Phoenix.Channel

  alias OTP.Workers.Queue

  def join("lobby:" <> mode, %{"color" => color}, socket) do
    socket =
      socket
      |> assign(:mode, mode)
      |> assign(:color, color)

    Queue.push(mode, self(), color, {socket.assigns.user_id, socket.assigns.address})
    {:ok, socket}
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def terminate(_reason, socket) do
    Queue.pop(socket.assigns.mode, {socket.assigns.user_id, socket.assigns.address})
    {:ok, socket}
  end

  @spec handle_info({:found_opponent, binary(), binary()}, Phoenix.Socket.t()) ::
          {:noreply, Phoenix.Socket.t()}
  def handle_info({:found_opponent, color, room_id}, socket) do
    push(socket, "room", %{roomId: room_id, color: color, id: socket.assigns.user_id})
    {:noreply, socket}
  end
end
