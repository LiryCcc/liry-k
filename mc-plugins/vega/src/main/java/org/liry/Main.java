package org.liry;


import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.liry.vega.VegaStatic;

public class Main extends JavaPlugin implements Listener {
  @Override
  public void onEnable() {
    getLogger().info("vega on enable");
    Bukkit.getPluginManager().registerEvents(this, this);
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent event) {
    var p = event.getPlayer();
    getLogger().info(String.format("vega on player join: player %s ", p.getName()));
    p.sendMessage("Hello, " + p.getName() + "!");
    VegaStatic.giveNightVision(p);
  }

}
